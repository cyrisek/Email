// document.addEventListener('DOMContentLoaded', function () {

//   // Use buttons to toggle between views
//   document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
//   document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
//   document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
//   document.querySelector('#compose').addEventListener('click', compose_email);
//   // Send form button
//   document.querySelector('#compose-form').onsubmit = send_email;

//   // By default, load the inbox
//   load_mailbox('inbox');
// });
$(document).ready(function () {
  // Use buttons to toggle between views
  $('#inbox').click(() => load_mailbox('inbox'));
  $('#sent').click(() => load_mailbox('sent'));
  $('#archived').click(() => load_mailbox('archive'));
  $('#compose').click(compose_email);
  // Send form button
  $('#compose-form').submit(send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

// function compose_email() {

//   // Show compose view and hide other views
//   document.querySelector('#emails-view').style.display = 'none';
//   document.querySelector('#details-view').style.display = 'none';
//   document.querySelector('#compose-view').style.display = 'block';

//   // Clear out composition fields
//   document.querySelector('#compose-recipients').value = '';
//   document.querySelector('#compose-subject').value = '';
//   document.querySelector('#compose-body').value = '';
// }
function compose_email() {
  // Show compose view and hide other views
  $('#emails-view').hide();
  $('#details-view').hide();
  $('#compose-view').show();

  // Clear out composition fields
  $('#compose-recipients').val('');
  $('#compose-subject').val('');
  $('#compose-body').val('');
}


// // view details of an email
// function view_email(id) {
//   fetch(`/emails/${id}`)
//     .then(response => response.json())
//     .then(email => {
//       // Print email
//       console.log(email);

//       // Show email view
//       document.querySelector('#emails-view').style.display = 'none';
//       document.querySelector('#compose-view').style.display = 'none';
//       document.querySelector('#details-view').style.display = 'block';

//       // Render HTML template
//       document.querySelector('#details-view').innerHTML = `
//       <ul>
//         <li><strong>From:</strong> ${email.sender}</li>
//         <li><strong>To:</strong> ${email.recipients}</li>
//         <li><strong>Subject:</strong> ${email.subject}</li>
//         <li><strong>Time:</strong> ${email.timestamp}</li>
//         <li>${email.body}</li>
//       </ul>
//       `

//       // Read function
//       if (email.read === false) {
//         fetch(`/emails/${email.id}`, {
//           method: 'PUT',
//           body: JSON.stringify({
//             read: true
//           })
//         })
//       }

//       // Archive and Unarchive mail
//       const archive = document.createElement('button');
//       if (email.archived === false) {
//         archive.className = "btn btn-sm btn-outline-secondary mx-2 mt-2";
//         archive.innerHTML = "Archive";
//       }
//       else {
//         archive.className = "btn btn-sm btn-outline-secondary mx-2 mt-2";
//         archive.innerHTML = "Unarchive";
//       }
//       archive.addEventListener('click', function () {
//         fetch(`/emails/${email.id}`, {
//           method: 'PUT',
//           body: JSON.stringify({
//             archived: !email.archived
//           })
//         })
//           .then(() => { load_mailbox('inbox') })
//       });
//       document.querySelector('#details-view').append(archive);

//       // Reply
//       const reply = document.createElement('button');
//       reply.innerHTML = "Reply";
//       reply.className = "btn btn-sm btn-outline-primary float-left mt-2";
//       reply.addEventListener('click', function () {
//         compose_email();

//         document.querySelector('#compose-recipients').value = email.sender;
//         document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
//         document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
//       });
//       document.querySelector('#details-view').append(reply);
//     });

// }
function view_email(id) {
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      // Print email
      console.log(email);

      // Show email view
      $('#emails-view').hide();
      $('#compose-view').hide();
      $('#details-view').show();

      // Render HTML template
      $('#details-view').html(`
        <ul>
          <li><strong>From:</strong> ${email.sender}</li>
          <li><strong>To:</strong> ${email.recipients}</li>
          <li><strong>Subject:</strong> ${email.subject}</li>
          <li><strong>Time:</strong> ${email.timestamp}</li>
          <li>${email.body}</li>
        </ul>
      `);

      // Read function
      if (email.read === false) {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        });
      }

      // Archive and Unarchive mail
      let archive = $('<button>');
      if (email.archived === false) {
        archive = `<button class="btn btn-sm btn-outline-dark mx-2 mt-2" id="archive-button">Archive</button>`;
      } else {
        archive = `<button class="btn btn-sm btn-outline-dark mx-2 mt-2" id="archive-button">Unarchive</button>`;
      }
      $('#details-view').append(archive);
      $('#archive-button').click(function () {
        fetch(`/emails/${email.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            archived: !email.archived
          })
        }).then(() => { load_mailbox('inbox') });
      });

      // Reply
      let reply = `<button class="btn btn-sm btn-outline-primary float-left mt-2" id="reply-button">Reply</button>`;
      $('#details-view').append(reply);
      $('#reply-button').click(function () {
        compose_email();
        $('#compose-recipients').val(email.sender);
        $('#compose-subject').val(`Re: ${email.subject}`);
        $('#compose-body').val(`On ${email.timestamp} ${email.sender} wrote: ${email.body}`);
      });
    });

}


// function load_mailbox(mailbox) {

//   // Show the mailbox and hide other views
//   document.querySelector('#emails-view').style.display = 'block';
//   document.querySelector('#compose-view').style.display = 'none';
//   document.querySelector('#details-view').style.display = 'none';

//   // Show the mailbox name
//   document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

//   // Get emails to Inbox
//   fetch(`/emails/${mailbox}`)
//     .then(response => response.json())
//     .then(emails => {

//       // Iterete through emails
//       emails.forEach(email => {

//         // Print email
//         // console.log(email);

//         // Create email template
//         const inboxEmail = document.createElement('div');
//         inboxEmail.className = "list-group-item";
//         inboxEmail.innerHTML = `
//         <div class="container my-2">
//           <div class="row justify-content-between">
//             <div class="col text-left my-3">
//               <h6>${email.sender}</h6>
//             </div>
//             <div class="col text-center my-3">
//               <h5>Subject: ${email.subject}</h5>
//             </div>
//             <div class="col text-right my-3">
//               <p>${email.timestamp}</p>
//             </div>
//           </div>
//         <div>
//         `;

//         // Check if email was red or not
//         const read = email.read
//         if (read === true) {
//           inboxEmail.className = "read";
//         }
//         else {
//           inboxEmail.className = "notred";
//         }

//         // add emails to html
//         inboxEmail.addEventListener('click', function () {
//           view_email(email.id)
//         });
//         document.querySelector('#emails-view').append(inboxEmail);
//       })
//     });
// }
function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  $('#emails-view').show();
  $('#compose-view').hide();
  $('#details-view').hide();

  // Show the mailbox name
  $('#emails-view').html(`<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`);

  // Get emails to Inbox
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {

      // Iterate through emails
      emails.forEach(email => {

        // Print email
        // console.log(email);

        // Create email template
        let inboxEmail = $('<div>');
        if (email.read === true) {
          inboxEmail = `<div class="single-email read" id="email-${email.id}">`;
        } else {
          inboxEmail = `<div class="single-email notred" id="email-${email.id}">`;
        }
        inboxEmail += `
          <div class="container my-2">
            <div class="row justify-content-between">
              <div class="col text-left m-3">
                <h6>${email.sender}</h6>
              </div>
              <div class="col text-start my-3">
                <h5>Subject: ${email.subject}</h5>
              </div>
              <div class="col text-right m-3">
                <p class="text-end">${email.timestamp}</p>
              </div>
            </div>
          </div>
        </div>
        `;

        // add emails to html
        $('#emails-view').append(inboxEmail);
        $(`#email-${email.id}`).click(function () {
          view_email(email.id)
        });
      });
    });
}

// function send_email() {
//   // Assign variables
//   const recipients = document.querySelector('#compose-recipients').value;
//   const subject = document.querySelector('#compose-subject').value;
//   const body = document.querySelector('#compose-body').value;
//   // Fetch data from the form and send email
//   fetch('/emails', {
//     method: 'POST,
//     body: JSON.stringify({
//       recipients: recipients,
//       subject: subject,
//       body: body,
//     })
//   })
//     .then(response => response.json())
//     .then(result => {
//       // Print result
//       console.log(result);

//     });
//   load_mailbox('sent');
//   return false;
// }
function send_email() {
  // Assign variables
  const recipients = $('#compose-recipients').val();
  const subject = $('#compose-subject').val();
  const body = $('#compose-body').val();
  // Fetch data from the form and send email
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body,
    })
  })
    .then(response => response.json())
    .then(result => {
      // Print result
      console.log(result);
    });
  load_mailbox('sent');
  return false;
}


