import { nanoid } from 'nanoid'
import './App.css'
import { useEffect, useState } from 'react'
import Split from 'react-split'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'

export default function App() {
	const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || [])
	const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || '')

	function createNewNote() {
		const newNote = {
			id: nanoid(),
			body: "# Type your markdown note's title here",
		}
		setNotes((prevNotes) => [newNote, ...prevNotes])
		setCurrentNoteId(newNote.id)
	}

	function updateNote(text) {
		setNotes((oldNotes) => {
			let newArray = []

			for (let i = 0; i < oldNotes.length; i++) {
				const note = oldNotes[i]

				if (note.id == currentNoteId) {
					newArray.unshift({ ...note, body: text })
				} else {
					newArray.push(note)
				}
			}

			return newArray
		})
	}

	function deleteNote(event, noteID) {
		event.stopPropagation()
		setNotes((oldNotes) => oldNotes.filter((note) => note.id != noteID))
	}

	const currentNote =
		notes.find((note) => {
			return note.id === currentNoteId
		}) || notes[0]

	useEffect(() => {
		localStorage.setItem('notes', JSON.stringify(notes))
	}, [notes])

	return (
		<main>
			{notes.length > 0 ? (
				<Split sizes={[30, 70]} direction="horizontal" className="split">
					<Sidebar notes={notes} currentNote={currentNote} setCurrentNoteId={setCurrentNoteId} newNote={createNewNote} deleteNote={deleteNote} />
					{currentNoteId && notes.length > 0 && <Editor currentNote={currentNote} updateNote={updateNote} />}
				</Split>
			) : (
				<div className="no-notes">
					<h1>You have no notes</h1>
					<button className="first-note" onClick={createNewNote}>
						Create one now
					</button>
				</div>
			)}
		</main>
	)
}
