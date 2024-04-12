import './App.css'
import { useEffect, useState } from 'react'
import Split from 'react-split'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db, notesCollection } from './firebase'

export default function App() {
	const [notes, setNotes] = useState([])
	const [currentNoteId, setCurrentNoteId] = useState('')

	console.log(currentNoteId)

	async function createNewNote() {
		const now = Date.now()
		const newNote = {
			body: "# Type your markdown note's title here",
			createdAt: now,
			updatedAt: now,
		}
		const noteRef = await addDoc(notesCollection, newNote)
		setCurrentNoteId(noteRef.id)
	}

	async function updateNote(text) {
		const docRef = doc(db, 'notes', currentNoteId)
		await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true })
	}

	async function deleteNote(noteID) {
		const docRef = doc(db, 'notes', noteID)
		await deleteDoc(docRef)
	}

	const currentNote =
		notes.find((note) => {
			return note.id === currentNoteId
		}) || notes[0]

	const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

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

	useEffect(() => {
		if (!currentNoteId) {
			setCurrentNoteId(notes[0]?.id)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [notes])

	return (
		<main>
			{notes.length > 0 ? (
				<Split sizes={[30, 70]} direction="horizontal" className="split">
					<Sidebar notes={sortedNotes} currentNote={currentNote} setCurrentNoteId={setCurrentNoteId} newNote={createNewNote} deleteNote={deleteNote} />
					<Editor currentNote={currentNote} updateNote={updateNote} />
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
