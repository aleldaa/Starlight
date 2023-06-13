import $ from 'jquery'

function HomePage({}){

    // const artistList = artist.map((a)=>{
    //     return <Artist
    //         key={a.id}
    //         name={a.name}
    //         genres={a.genres}
    //     />
    // })

    function handleClick(){
        const popup = document.getElementById('myPopup')
        popup.classList.toggle('show')
    }

    $(function() {
        var dimmerButton = $('.popup-title');
        var dimmer = $('.popup');
        var exit = $('.exit');
        dimmerButton.on('click', function() {
          dimmer.show();
        });
        exit.on('click', function() {
          dimmer.hide();
        });
      });

    return(
        <div>
            <div className="homepage-wrapper">
                <div className="popup-title" onClick={handleClick}>
                    <h5>What fuels your ✨sparkle✨ today?</h5>
                </div>
                <div className="popup">
                    <span className="popuptext" id="myPopup">
                    <button className='exit'>X</button>
                        <form>
                            <textarea type="text" className="popup-input" placeholder="Write your post."/>
                            <button type="submit" className=""></button>
                        </form>
                    </span>
                </div>
                <div className=''></div>
            </div>
        </div>
    )
}

export default HomePage