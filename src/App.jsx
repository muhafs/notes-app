import './App.css'
import { useEffect, useState } from 'react'
import Split from 'react-split'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import { addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore'
import { db, notesCollection } from './firebase'

export default function App() {
	const [notes, setNotes] = useState([])
	const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || '')

	async function createNewNote() {
		const newNote = {
			body: "# Type your markdown note's title here",
		}
		const noteRef = await addDoc(notesCollection, newNote)
		setCurrentNoteId(noteRef.id)
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

	async function deleteNote(noteID) {
		const docRef = doc(db, 'notes', noteID)
		await deleteDoc(docRef)
	}

	const currentNote =
		notes.find((note) => {
			return note.id === currentNoteId
		}) || notes[0]

	useEffect(() => {
		const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
			const notesArr = snapshot.docs.map((doc) => ({
				...doc.data(),
				id: doc.id,
			}))

			setNotes(notesArr)
		})

		return unsubscribe
	}, [])

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
