/**
 * Gmail Invoice Forwarder
 * Automatically forwards unread emails labeled with the configured label to a functional mailbox
 * and marks them as read. This is useful for routing invoices to accounting/finance departments
 * or shared mailboxes for processing.
 * 
 * This is part of the gmail-automations repository which can contain multiple Gmail automation scripts.
 */

/**
 * Main function to process invoice emails
 * Forwards invoices to a functional mailbox for centralized processing
 */
function forwardInvoiceEmails() {
  const functionalMailbox = CONFIG.TARGET_EMAIL;
  const labelName = CONFIG.LABEL_NAME;
  
  try {
    // Get the "Invoices" label
    const label = GmailApp.getUserLabelByName(labelName);
    if (!label) {
      console.log(`Label "${labelName}" not found. Please create this label in Gmail.`);
      return;
    }
    
    // Get unread threads with the "Invoices" label
    const threads = label.getThreads();
    const unreadThreads = threads.filter(thread => thread.isUnread());
    
    console.log(`Found ${unreadThreads.length} unread invoice emails to process`);
    
    // Process each unread thread
    unreadThreads.forEach((thread, index) => {
      try {
        processInvoiceThread(thread, functionalMailbox);
        console.log(`Processed thread ${index + 1}/${unreadThreads.length}: ${thread.getFirstMessageSubject()}`);
      } catch (error) {
        console.error(`Error processing thread "${thread.getFirstMessageSubject()}":`, error);
      }
    });
    
    console.log(`Successfully processed ${unreadThreads.length} invoice emails`);
    
  } catch (error) {
    console.error('Error in forwardInvoiceEmails:', error);
    throw error;
  }
}

/**
 * Process a single email thread
 * @param {GmailThread} thread - The Gmail thread to process
 * @param {string} functionalMailbox - The functional mailbox address to forward to
 */
function processInvoiceThread(thread, functionalMailbox) {
  // Get all messages in the thread
  const messages = thread.getMessages();
  
  // Process each unread message in the thread
  messages.forEach(message => {
    if (message.isUnread()) {
      forwardMessage(message, functionalMailbox);
      message.markRead();
    }
  });
}

/**
 * Forward a Gmail message to the functional mailbox
 * @param {GmailMessage} message - The Gmail message to forward
 * @param {string} functionalMailbox - The functional mailbox address to forward to
 */
function forwardMessage(message, functionalMailbox) {
  const subject = `Fwd: ${message.getSubject()}`;
  const originalSender = message.getFrom();
  const originalDate = message.getDate();
  const originalBody = message.getBody();
  
  // Create forwarded message body with routing information
  const forwardedBody = `
---------- Forwarded Invoice ----------
From: ${originalSender}
Date: ${originalDate}
Subject: ${message.getSubject()}
Forwarded for: Invoice Processing

${originalBody}
  `;
  
  // Get attachments
  const attachments = message.getAttachments();
  
  // Send the forwarded email to functional mailbox
  if (attachments.length > 0) {
    GmailApp.sendEmail(functionalMailbox, subject, forwardedBody, {
      attachments: attachments,
      htmlBody: forwardedBody
    });
  } else {
    GmailApp.sendEmail(functionalMailbox, subject, forwardedBody);
  }
  
  console.log(`Forwarded invoice: "${message.getSubject()}" to functional mailbox ${functionalMailbox}`);
}

/**
 * Set up automatic trigger to run every 30 minutes
 * Run this function once to set up the automation for invoice routing
 */
function setupTrigger() {
  // Delete existing triggers for this function
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'forwardInvoiceEmails') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Create new trigger to run every 30 minutes
  ScriptApp.newTrigger('forwardInvoiceEmails')
    .timeBased()
    .everyMinutes(30)
    .create();
    
  console.log('Trigger set up to run forwardInvoiceEmails every 30 minutes');
}

/**
 * Remove all triggers for this project
 * Run this function to stop automation
 */
function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'forwardInvoiceEmails') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  console.log('All triggers removed');
}

/**
 * Test function to check if everything is working
 * Run this manually to test the setup
 */
function testSetup() {
  console.log('Testing Gmail Invoice Forwarder setup...');
  
  // Check if configured label exists
  const label = GmailApp.getUserLabelByName(CONFIG.LABEL_NAME);
  if (!label) {
    console.log(`❌ "${CONFIG.LABEL_NAME}" label not found. Please create this label in Gmail.`);
    return false;
  }
  console.log(`✅ "${CONFIG.LABEL_NAME}" label found`);
  
  // Check for invoice emails
  const threads = label.getThreads();
  console.log(`📧 Found ${threads.length} total emails with "${CONFIG.LABEL_NAME}" label`);
  
  const unreadThreads = threads.filter(thread => thread.isUnread());
  console.log(`📬 Found ${unreadThreads.length} unread invoice emails ready for forwarding to functional mailbox`);
  
  console.log(`📮 Functional mailbox configured: ${CONFIG.TARGET_EMAIL}`);
  console.log('✅ Setup test completed successfully');
  return true;
}
