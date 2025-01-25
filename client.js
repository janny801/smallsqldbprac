document.addEventListener('DOMContentLoaded', () => {
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
                    <button class="edit-btn" data-id="${note.id}">Edit</button> 
                    <button class="delete-btn" data-id="${note.id}">Delete</button>
                `;
                notesList.appendChild(listItem);
            });
            console.log('Calling attachEditEventListeners...');

            // Attach event listeners after the delete buttons have been added to the DOM
            attachEditEventListeners(); // Attach edit listeners after notes are rendered
            attachDeleteEventListeners();
            attachSortEventListener(data); // Attach the sorting functionality
        })
        .catch(error => {
            console.error('Error fetching notes:', error);
            const notesList = document.getElementById('notes-list');
            notesList.innerHTML = '<li style="color: red;">Failed to load notes.</li>';
        });
});

function attachDeleteEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', event => {
            const noteId = event.target.getAttribute('data-id');
            document.getElementById('deleteModal').style.display = 'block';
            document.getElementById('deleteModal').setAttribute('data-note-id', noteId);
        });
    });
}




function attachEditEventListeners() {
    console.log('Attaching event listeners to .edit-btn buttons...'); //for test


    document.querySelectorAll('.edit-btn').forEach(button => {
        console.log('Attaching event listener to button with data-id:', button.getAttribute('data-id')); //for test

        button.addEventListener('click', event => {
            const noteId = event.target.getAttribute('data-id');
            console.log('Edit button clicked for note ID:', noteId);
            console.log('Fetching note with ID:', noteId); //for testing


            fetch(`/notes/${noteId}`)
                .then(response => {
                    console.log('Raw response:', response); // Logs the raw response object
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // Parses the JSON body of the response
                })
                .then(note => {
                    console.log('Fetched note for edit:', note); // Logs the parsed JSON object
                    document.getElementById('editTitle').value = note.title;
                    document.getElementById('editContents').value = note.contents;
                    document.getElementById('editModal').setAttribute('data-note-id', noteId);
                    document.getElementById('editModal').style.display = 'block';
                })
                .catch(error => {
                    console.error('Error loading note for edit:', error);
                });

                    });
                });
}



function attachSortEventListener(notesData) {
    const sortDropdown = document.getElementById('sortDropdown');
    sortDropdown.addEventListener('change', () => {
        const sortedNotes = [...notesData].sort((a, b) => {
            const dateA = new Date(a.created);
            const dateB = new Date(b.created);
            return sortDropdown.value === 'oldest' ? dateA - dateB : dateB - dateA;
        });
        displaySortedNotes(sortedNotes);
    });
}

function displaySortedNotes(sortedNotes) {
    const notesList = document.getElementById('notes-list');
    notesList.innerHTML = ''; // Clear the existing list
    sortedNotes.forEach(note => {
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
    attachDeleteEventListeners(); // Reattach delete event listeners to new DOM elements
}


/*

use modal instead of prompt()
        //event listeners for delete buttons
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const noteId = event.target.getAttribute('data-id');
                const password = prompt("Enter password to delete the note:");

                const response = await fetch(`/delete-note/${noteId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ password }), // Send password for validation
                });

                if (response.ok) {
                    alert('Note deleted successfully!');
                    event.target.closest('li').remove(); // Remove the note from the UI
                } else {
                    alert('Failed to delete note. ' + await response.text()); // Show error message
                }
            });
        });

*/ 


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



// Event listener for the OK button in the modal (for the deletion function)
document.getElementById('confirmBtn').addEventListener('click', async () => {
    const noteId = document.getElementById('deleteModal').getAttribute('data-note-id');
    const password = document.getElementById('deletePassword').value;

    const response = await fetch(`/delete-note/${noteId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }), // Send password for validation
    });

    if (response.ok) {
        alert('Note deleted successfully!');
        document.querySelector(`[data-id="${noteId}"]`).closest('li').remove(); // Remove the note from the UI
    } else {
        alert('Failed to delete note. ' + await response.text()); // Show error message
    }

    // Close the modal after the operation
    document.getElementById('deleteModal').style.display = 'none';
});

// Event listener for the Cancel button
document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('deleteModal').style.display = 'none'; // Close the modal
});




document.getElementById('saveEditBtn').addEventListener('click', async () => {
    const noteId = document.getElementById('editModal').getAttribute('data-note-id');
    const title = document.getElementById('editTitle').value;
    const contents = document.getElementById('editContents').value;
    const password = document.getElementById('editPassword').value;

    try {
        const response = await fetch(`/update-note/${noteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, contents, password })
        });

        if (response.ok) {
            alert('Note updated successfully!');
            document.getElementById('editModal').style.display = 'none';
            window.location.reload(); // Reload to show updated note
        } else {
            const errorMessage = await response.text();
            alert(`Failed to update note. Error: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        alert('Error sending request.');
    }
});
