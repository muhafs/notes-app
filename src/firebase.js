import { initializeApp } from 'firebase/app'
import { collection, getFirestore } from 'firebase/firestore'

const firebaseConfig = {
	apiKey: 'AIzaSyB6HmIpKOHXhDW0LHXfLFfz5iNCKtcaMiI',
	authDomain: 'react-notes-1603a.firebaseapp.com',
	projectId: 'react-notes-1603a',
	storageBucket: 'react-notes-1603a.appspot.com',
	messagingSenderId: '678726884621',
	appId: '1:678726884621:web:37b48dc186b431d56ea444',
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const notesCollection = collection(db, 'notes')
