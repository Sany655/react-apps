import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import Spinner from '../components/Spinner'
import EditorJS from "https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest";
const Notes = () => {
    const [notes, setNotes] = useState([])
    const [text, setText] = useState('')
    const [tag, setTag] = useState('')
    const [loading, setLoading] = useState(true)
    const user = useSelector(state => state.auth).user

    const searchNote = (e) => {
        const text = e.target.value
        if (text.length > 0) {
            setNotes(notes.filter(note => (note.text.includes(text) || note.tag.includes(text))));
        } else if (text.length === 0) {
            setLoading(true)
        }
    }

    useEffect(() => {
        onSnapshot(query(collection(getFirestore(), 'notes', user.uid, 'note'), orderBy('timestamp', 'desc')), (snapshot) => {
            setNotes(snapshot.docs.map(doc => ({
                id: doc.id,
                text: doc.data().text,
                tag: doc.data().tag?.join(' '),
                timestamp: String(doc.data().timestamp?.toDate().toLocaleTimeString()) + ' - ' + String(doc.data().timestamp?.toDate().toLocaleDateString()),
                updatedAt: String(doc.data().updatedAt?.toDate().toLocaleTimeString()) + ' - ' + String(doc.data().updatedAt?.toDate().toLocaleDateString())
            })))
            setLoading(false)
        });
    }, [user.uid, loading])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (text.length !== 0 && tag.length !== 0) {
            addDoc(collection(getFirestore(), "notes", user.uid, 'note'), {
                tag: tag.split(' '),
                text: text.replace(/<br\s*\/?>/gi, "\n"),
                timestamp: serverTimestamp()
            }).then(res => {
                setText('')
                setTag('')

            }).catch(err => console.log(err));
        }
    }

    function deleteNote(id) {
        if (window.confirm("Are sure to Delete this note?")) {
            deleteDoc(doc(getFirestore(), 'notes', user.uid, 'note', id)).then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err);
            })
        }
    }

    return (
        <div className="container">
            <div className="d-flex align-items-center justify-content-between mt-5">
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addNoteModal">Add Note</button>
                <div className="row">
                    <div className="col">
                        <input onChange={searchNote} type="text" className="form-control" placeholder='Search' />
                    </div>
                </div>
            </div>
            <div className="modal fade" id="addNoteModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Notes</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form onSubmit={handleSubmit} className="">
                            <div className="modal-body">
                                <input onChange={e => { setTag(e.target.value) }} value={tag} type="text" className="form-control mb-2" placeholder='Title' />
                                <textarea onChange={e => { setText(e.target.value) }} className="form-control" placeholder='Details' value={text}></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {loading && <Spinner />}
            <div className="row my-4">
                {
                    notes.map(note => (
                        <div key={note.id} className="col-md-4 mb-5">
                            <div className="card">
                                <div className="card-body overflow-auto" style={{ height: "250px" }}>
                                    <p>{note.tag}</p>
                                    <p>{note.timestamp}</p>
                                    <hr />
                                    <p>{note.text}</p>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteNote(note.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Notes