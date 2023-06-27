function Comments({content, user}){
    return(
        <div className="comment-wrapper">
            <div className="comment">
                <h5>{user.name}</h5>
                <p>{content}</p>
            </div>
        </div>
    )
}

export default Comments