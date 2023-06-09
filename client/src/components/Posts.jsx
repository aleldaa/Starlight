import { useState, useEffect } from "react";

function Posts({ title, content, user, currentUser, handleEdit, handleDelete, handleEditTitle, handleEditContent, id }) {
    const [isCurrentUserPost, setIsCurrentUserPost] = useState(false);
    const [edit, setEdit] = useState(false)
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedContent, setEditedContent] = useState(content);

  useEffect(() => {
    setIsCurrentUserPost(currentUser && currentUser.id=== user.id);
  }, [currentUser, user]);

  function handleEditSubmit(e){

    const updatedPost = {
        title: editedTitle,
        content: editedContent
    }
    handleEdit(id, updatedPost)
    setEdit(false)
  }

  function handleInput(e){
    if (e.target.id === 'title'){
        setEditedTitle(e.target.textContent)
        handleEditTitle(e)
    }
    else if (e.target.id === 'content'){
        setEditedContent(e.target.textContent)
        handleEditContent(e)
    }
  }

  return (
    <div className="posts">
        {edit ? (
        <div className="post-body">
            <h2 className='post-title'contentEditable onInput={handleInput} id="title">{title}</h2>
            <h5>{user.username}</h5>
            <h4 className="post-content" contentEditable onInput={handleInput} id="content">{content}</h4>
            <button onClick={handleEditSubmit}>Submit Edit</button>
        </div>
        ) : (
            <div className="post-body">
                <h2>{title}</h2>
                <h5>{user.username}</h5>
                <h4 className="post-content">{content}</h4>
            </div>
        ) }
        {isCurrentUserPost && (
        <div className="edit-delete-button">
          <button onClick={()=>handleDelete(id)}>Delete</button>
          <button onClick={()=>setEdit(!edit)}>Edit</button>
        </div>
      )} 
    </div>
  );
}

export default Posts;