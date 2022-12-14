import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import Footer from "../organisms/Footer";
import Header from "../organisms/Header";
import GetLoginUserName from "../utils/GetLoginUserData";
import {
  AiFillHeart,
  AiOutlineClose,
  AiOutlineHeart,
  AiOutlineMessage,
} from "react-icons/ai";
import CommentsDisplay from "../molecules/CommentsDisplay";
import KeepButton from "../atoms/button/KeepButton";
import Time from "../molecules/Time";
import FavoLength from "../molecules/FavoLength";
import Caption from "../molecules/Caption";
import PostIcon from "../atoms/icon/PostIcon";
import Img from "../atoms/pictures/Img";
import { Post } from "../../types/types";

function PostLook() {
  // followuserのpostidからとってきたpostData
  const [postData, setPostData] = useState<any>([]);
  // // postid保持
  // const[postId,setPostId]=useState<any>("");
  // inputcommentを格納
  const [inputComment, setInputComment] = useState<any>("");
  // ログインしているユーザーのuserNameを格納
  const [loginUserName, setLoginUserName] = useState<any>("");

  // ログインしているユーザーのfollowしている人のIdの配列
  const [followUser, setFollowUser] = useState<any>([]);

  // ログインしているユーザーのpostの配列
  // const [myPostId, setMyPostID] = useState<any>([]);

  const [loginUserKeep, setLoginUserKeep] = useState<any>("");

  //
  // const [postDataSecond,  setPostDataSecond] = useState<any>({});

  const [favbtn, setFavbtn] = useState(1);
  // コメントの表示非表示
  const [commentDisplay, setCommentDisplay] = useState<boolean>(false);

  const [userId, setUserId] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      // ログインしているユーザーのuserNameをuseStateで保持
      GetLoginUserName(user).then((loginUserData: any) => {
        setLoginUserName(loginUserData.userName);
        setUserId(loginUserData.userId);
      });

      if (!user) {
      <></>
      } else {
        // ログインしているユーザーのデータ取得
        // GetLoginUserName(user).then((loginUserData:any)=>{
        //     setFollowUser(loginUserData.follow);
        //     setMyPostID(loginUserData.post)
        // })

        //ログインしているユーザーのドキュメントへの参照を取得
        const docusesinformation = doc(db, "user", user.uid);
        //上記を元にドキュメントのデータを取得
        const userDataDoc = await getDoc(docusesinformation);
        //取得したデータから必要なものを取り出す
        const userDatas = userDataDoc.data();
        // ログインしているユーザーのフォローしている人のuseridを配列に格納
        const UseLoginUserFollowUserIdArray = userDatas?.follow;

        setFollowUser(UseLoginUserFollowUserIdArray);

        const postDataArray: any[] = [];

        // followuserのpostドキュメントを配列に格納
        UseLoginUserFollowUserIdArray.forEach(async (followUserId: any) => {
          const q = query(
            collection(db, "post"),
            where("userId", "==", followUserId)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const followUserPost = (doc.id, " => ", doc.data());
            postDataArray.push(followUserPost);
          });
        });

        // ログインしているユーザーのpost情報を配列に格納
        const myPostId = userDatas?.posts;
        for (let postid of myPostId) {
          const information = doc(db, "post", postid);
          const DataDoc = await getDoc(information);
          const Datas = DataDoc.data();
          postDataArray.push(Datas);
        }

        // データを保持
        setPostData(postDataArray);

        // ランダムの数値のpostを取得
        // const getRandomArbitrary = (min: number, max: number) => {
        //   min = Math.ceil(min);
        //   max = Math.floor(max);
        //   return Math.floor(Math.random() * (max - min + 1) + min);
        // };

        // const randomArray: any[] = [];
        // const q = query(
        //   collection(db, "post"),
        //   where("number", "==", getRandomArbitrary(1, 5))
        // );
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //   const followUserPost = (doc.id, " => ", doc.data());
        //   randomArray.push(followUserPost);
        // });
        // setRamData(randomArray);

      }
    });
  }, [favbtn]);

  // 日付順に並び替え
  postData.sort((a: any, b: any) => {
    return a.postDate.toDate() > b.postDate.toDate() ? -1 : 1;
  });

  const CommentDisplay = (e: React.MouseEvent) => {
    setCommentDisplay(true);
  };

  const CommentBack = (e: React.MouseEvent) => {
    setCommentDisplay(false);
  };

  return (
    <>
      <Header show={true} />
      <div className="postlook">
        {postData.length === 0 ? (
          <>

            <div className="lead_article"
            // style={{ marginTop: "60px" }}
            >
              {/* <div style={{ width: "100%" }}> */}
                <p className="lead_center"
                // style={{ textAlign: "center" }}
                >投稿がありません</p>
              {/* </div> */}
              <div className="lead_center"
              // style={{ textAlign: "center" }}
              >
                {/* style={{margin:"0 auto",}} */}
                <Link to="/SearchPage">
                  <button className="btn">検索してみよう！</button>
                </Link>
              </div>
</div>
          </>
        ) : (
          <>
            <div>
              {postData.map((data: Post, index: string) => {
                const favos = [...data.favorites];
                const com = [...data.comments];
                return (
                  <>
                    <div key={index}>
                      <div
                        className="postlook__iconusername"
                        // style={{
                        //   display: "flex",
                        //   alignItems: "center",
                        //   width: "100%",
                        //   marginTop:"30px"
                        // }}
                      >
                        {/* <div className="postDetails_postIcon"> */}
                        <div className="postlook__postIcon">
                          <Link
                            to={data.userId === userId ? "/mypage" : "/profile"}
                            state={{ userId: data.userId }}
                          >
                            <PostIcon icon={data.icon} />
                          </Link>
                        </div>

                        <p
                          className="postlook__username"
                          // style={{ fontSize: "20px", marginLeft: "5px" }}
                        >
                          <Link
                            to={data.userId === userId ? "/mypage" : "/profile"}
                            state={{ userId: data.userId }}
                          >
                            {data.userName}
                          </Link>
                        </p>
                      </div>

                      {/* 画像 */}
                      <Link
                        to="/PostDetails"
                        state={{ postid: data.postId, userid: data.userId }}
                      >
                        <Img imgUrl={data.imageUrl} />
                      </Link>

                      {/* いいねコメント保存 */}

                      <div className="postlook__favocomkeep"
                      // style={{ display: "flex", marginBottom: "0" }}
                      >
                        {/* いいねボタン */}
                        <div
                          className="postlook__favo"
                          // style={{ margin: "10px 5px 0px 5px" }}
                        >
                          {data.favorites.includes(loginUserName) ? (
                            <AiFillHeart
                            className="postlook__favBtn"
                              size={30}
                              color={"red"}
                              onClick={(e: React.MouseEvent) => {
                                updateDoc(
                                  doc(collection(db, "post"), data.postId),
                                  {
                                    favorites: arrayRemove(loginUserName),
                                  }
                                );
                                setFavbtn(favbtn + 1);
                              }}
                            />
                          ) : (
                            <AiOutlineHeart
                            className="postlook__favBtn"
                              size={30}
                              color={"black"}
                              onClick={(e: React.MouseEvent) => {
                                updateDoc(
                                  doc(collection(db, "post"), data.postId),
                                  {
                                    favorites: arrayUnion(loginUserName),
                                  }
                                );
                                setFavbtn(favbtn + 1);
                              }}
                            />
                          )}
                        </div>

                        {/* コメントボタン */}
                        <div
                          className="postlook__com"
                          // style={{ margin: "10px 5px 0px 5px" }}
                        >
                          <AiOutlineMessage
                          className="postlook__commentBtn"
                            size={30}
                            color={"black"}
                            onClick={CommentDisplay}
                          />
                        </div>

                        {/* 保存ボタン */}
                        <div
                          className="postlook__keep"
                          // style={{ margin: "5px 5px 0px auto" }}
                        >
                          <KeepButton
                            loginUserKeep={loginUserKeep}
                            data={data.postId}
                          />
                        </div>
                      </div>

                      {/* いいね数、投稿時間 */}
                      <div
                        className="postlook__favolengthtime"
                        // style={{ display: "flex" }}
                      >
                        <FavoLength favos={favos} />
                        <Time data={data.postDate} />
                      </div>

                      {/* キャプション */}
                      <Caption data={data.caption} />

                      <div>
                        {commentDisplay ? (
                          <>
                            {/* コメント表示 */}
                            <CommentsDisplay displayComment={com} />

                            <div
                              className="postlook__comdisplay"
                              // style={{ display: "flex", width: "100%" }}
                            >
                              {/* コメント投稿セット */}
                              <div
                                className="postlook__cominput"
                                // style={{
                                //   display: "flex",
                                //   width: "70%",
                                //   height: "30px",
                                //   margin: "5px",
                                // }}
                              >
                                <input
                                  className="postlook__input"
                                  type="text"
                                  value={inputComment}
                                  onChange={(e) => {
                                    setInputComment(e.target.value);
                                  }}
                                  // style={{ width: "100%" }}
                                />
                              </div>

                              <div
                                className="postlook__btn"
                                // style={{ marginLeft: "auto", width: "30%" }}
                              >
                                <button
                                  className="btn"
                                  onClick={async (e: React.MouseEvent) => {
                                    // 押された投稿のcommentにinputCommentを配列で追加
                                    updateDoc(
                                      doc(collection(db, "post"), data.postId),
                                      {
                                        comments: arrayUnion({
                                          userName: loginUserName,
                                          commentText: inputComment,
                                        }),
                                      }
                                    );
                                    setFavbtn(favbtn + 1);
                                    setInputComment("");
                                  }}
                                >
                                  投稿する
                                </button>
                              </div>
                              <AiOutlineClose
                                className="postlook__closebtn"
                                // style={{
                                //   display: "block",
                                //   margin: "15px 0 0 auto",
                                //   alignItems: "center",
                                // }}
                                size={15}
                                color={"rgb(38, 38, 38)"}
                                onClick={CommentBack}
                              />
                            </div>
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default PostLook;
