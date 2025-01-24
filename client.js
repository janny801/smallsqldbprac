

// Fetch existing notes and display them
fetch('/notes')
    .then(response => response.json())
    .then(data => {
        const notesList = document.getElementById('notes-list');
        data.forEach(note => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>ID:</strong> ${note.id} <br>
                <strong>Title:</strong> ${note.title} <br>
                <strong>Contents:</strong> ${note.contents} <br>
                <strong>Created:</strong> ${note.created}
                <button class="delete-btn" data-id="${note.id}">Delete</button>
            `;
            notesList.appendChild(listItem);
        });
        // Add event listeners for delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
                deleteButtons.forEach(button => {
                    button.addEventListener('click', (event) => {
                        const noteId = event.target.getAttribute('data-id');
                        console.log(`Delete note with ID: ${noteId}`);
                        // You will implement the delete functionality here later
                    });
                });
    })
    .catch(error => {
        console.error('Error fetching notes:', error);
        const notesList = document.getElementById('notes-list');
        notesList.innerHTML = '<li style="color: red;">Failed to load notes.</li>';
    });

// Add a new note
document.getElementById('noteForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const contents = document.getElementById('contents').value;
    const password = document.getElementById('password').value; // Capture the password

    const response = await fetch('/add-note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, contents, password }), // Send password along with title and contents
    });

    if (response.ok) {
        alert('Note added successfully!');
        window.location.reload(); // Reload the page to see the new note
    } else {
        alert('Failed to add note. ' + await response.text()); // Display error message from server
    }
});

