// functions/index.js
const {onObjectFinalized} = require("firebase-functions/v2/storage");
const admin = require("firebase-admin");
const pdfParse = require("pdf-parse");
const {Storage} = require("@google-cloud/storage");
const os = require("os");
const path = require("path");
const fs = require("fs");

admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();

exports.parseResume = onObjectFinalized(async (event) => {
  try {
    // event.data is the Storage object
    const object = event.data;
    const filePath = object.name || "";
    if (!filePath.startsWith("resumes/")) {
      console.log("Not a resume file. Exiting function.");
      return;
    }

    const bucketName = object.bucket;
    const bucket = storage.bucket(bucketName);
    const fileName = path.basename(filePath);
    const tempFilePath = path.join(os.tmpdir(), fileName);

    // Download the file from Storage
    await bucket.file(filePath).download({destination: tempFilePath});
    console.log("Downloaded file to:", tempFilePath);

    // Read file
    const dataBuffer = fs.readFileSync(tempFilePath);

    // Parse PDF
    const pdfData = await pdfParse(dataBuffer);
    const fullText = pdfData.text;

    // Work experience extraction...
    const workExpRegex =
      /(?:Experience|Work History)([\s\S]*?)(?:Education|Skills|$)/i;
    const match = fullText.match(workExpRegex);
    const workHistory = match ? match[1].trim() : "No work history found.";

    // Contact info extraction...
    const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
    const phoneRegex = /\+?\d[\d\s-]{7,}/g;
    const contactEmails = fullText.match(emailRegex) || [];
    const contactPhones = fullText.match(phoneRegex) || [];
    const contactInfo = {emails: contactEmails, phones: contactPhones};

    // Build public download URL
    const resumeURL = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(
        filePath,
    )}?alt=media`;

    // Find matching application doc
    const appQuerySnapshot = await db
        .collectionGroup("applications")
        .where("resumeURL", "==", resumeURL)
        .get();

    if (appQuerySnapshot.empty) {
      console.log("No matching application doc found for:", resumeURL);
    } else {
      const appDoc = appQuerySnapshot.docs[0];
      console.log("Found matching application:", appDoc.id);

      await appDoc.ref.update({
        workHistory,
        contactInfo,
        parsedAt: new Date(),
      });
      console.log("Updated application with parsed resume data.");
    }

    // Clean up
    fs.unlinkSync(tempFilePath);
    console.log("Cleaned up temp file.");
    return;
  } catch (err) {
    console.error("Error parsing resume:", err);
    return;
  }
});
