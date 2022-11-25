import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import firebasePostDetails from "./firebasePostDetails";
import FirestoreUpdata from "./FirestoreUpdata";
import Footer from "./component/molecules/Footer";
import Header from "./component/molecules/Header";

interface State {
    postid:string,
    userid:string
}

function PostEditing() {

// postlookからデータを持ってくる
const location = useLocation();
const {postid,userid} = location.state as State

// 画像urlを格納
const [imgUrl, setimgUrl] = useState<any>("");
// textを格納
const [text, setText] = useState<any>("");

useEffect(()=>{
firebasePostDetails(postid,userid).then((postData)=>{
setimgUrl(postData.Imgurl)
setText(postData.Caption)
})
}, [])

const Updata = ((e:any)=>{
console.log(text)
FirestoreUpdata(postid,text)
})

return (
<>
{/* <Header /> */}
<div>
<img src={imgUrl} />
<input type="text" value={text} onChange={(e)=>{setText(e.target.value)}}></input>
<Link to="/PostLook"><button onClick={Updata}>編集完了</button></Link>
<Link to="/PostLook"><button>戻る</button></Link>
</div>
<Footer />
</>
);
}


export default PostEditing;
