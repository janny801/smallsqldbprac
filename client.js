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

            // Attach event listeners after the notes are rendered
            attachEditEventListeners();
            attachDeleteEventListeners();
        })
        .catch(error => {
            console.error('Error fetching notes:', error);
            const notesList = document.getElementById('notes-list');
            notesList.innerHTML = '<li style="color: red;">Failed to load notes.</li>';
        });
});

// Event delegation for delete button
function attachDeleteEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', event => {
            const noteId = event.target.getAttribute('data-id');
            document.getElementById('deleteModal').style.display = 'block';
            document.getElementById('deleteModal').setAttribute('data-note-id', noteId);
        });
    });
}

// Event delegation for edit button
function attachEditEventListeners() {
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', event => {
            const noteId = event.target.getAttribute('data-id');
            fetch(`/notes/${noteId}`)
                .then(response => response.json())
                .then(note => {
                    document.getElementById('editTitle').value = note.title;
                    document.getElementById('editContents').value = note.contents;
                    document.getElementById('editModal').setAttribute('data-note-id', noteId);
                    document.getElementById('editModal').style.display = 'block';
                })
                .catch(error => console.error('Error fetching note for edit:', error));
        });
    });
}

// Sorting functionality
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
    notesList.innerHTML = '';
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
    attachDeleteEventListeners();
}

// Add a new note
document.getElementById('noteForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const contents = document.getElementById('contents').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/add-note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, contents, password }),
    });

    if (response.ok) {
        alert('Note added successfully!');
        window.location.reload();
    } else {
        alert('Failed to add note. ' + await response.text());
    }
});

// Deleting the note
document.getElementById('confirmBtn').addEventListener('click', async () => {
    const noteId = document.getElementById('deleteModal').getAttribute('data-note-id');
    const password = document.getElementById('deletePassword').value;

    const response = await fetch(`/delete-note/${noteId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
    });

    if (response.ok) {
        alert('Note deleted successfully!');
        document.querySelector(`[data-id="${noteId}"]`).closest('li').remove();
    } else {
        alert('Failed to delete note. ' + await response.text());
    }

    document.getElementById('deleteModal').style.display = 'none';
});

// Cancel Delete Modal
document.getElementById('cancelBtn').addEventListener('click', () => {
    document.getElementById('deleteModal').style.display = 'none';
});

// Edit note functionality
document.getElementById('saveEditBtn').addEventListener('click', async () => {
    const noteId = document.getElementById('editModal').getAttribute('data-note-id');
    const title = document.getElementById('editTitle').value;
    const contents = document.getElementById('editContents').value;
    const password = document.getElementById('editPassword').value;

    const response = await fetch(`/update-note/${noteId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, contents, password }),
    });

    if (response.ok) {
        alert('Note updated successfully!');
        document.getElementById('editModal').style.display = 'none';
        window.location.reload();
    } else {
        const errorMessage = await response.text();
        alert(`Failed to update note. Error: ${errorMessage}`);
    }
});

// Cancel Edit Modal
document.getElementById('cancelEditBtn').addEventListener('click', () => {
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('editTitle').value = '';
    document.getElementById('editContents').value = '';
    document.getElementById('editPassword').value = '';
});
