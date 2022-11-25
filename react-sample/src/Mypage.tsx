import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  getDoc,
  getDocs,
  query,
  QuerySnapshot,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Icon from "./component/atoms/pictures/Icon";
import UserName from "./component/atoms/user/UserName";
import MyPostList from "./component/molecules/MyPostList";
import { auth, db } from "./firebase";
import { User } from "./types/types";
import { Post } from "./types/types";
import Footer from "./component/molecules/Footer";
import Header from "./component/molecules/Header";
import MyPageInfo from "./component/molecules/MyPageInfo";
import Name from "./component/atoms/user/Name";

function MyPage() {
  //ログインしているとログイン情報を持つ
  const [user, setUser] = useState<any>("");

  //ログイン判定が終わるまでリダイレクトさせないようにする(ログイン判定するには時間がかかるから、ページ遷移を先にされてしまうと表示がおかしくなってしまう)
  const [loading, setLoading] = useState(true);

  //取得してきたデータを保持
  const [users, setUsers] = useState<any>([]);
  const [posts, setPosts] = useState<QuerySnapshot[]>([]);

  //userのpost配列
  // const [postList, setPostList] = useState<any>({ post: [] });

  //userのfollow配列
  const [followList, setFollowList] = useState<any>({ follow: [] });

  //userのfollower配列
  const [followerList, setFollowerList] = useState<any>({ follower: [] });

  // ログインしているかどうか判定
  //ログインしていればuserにユーザー情報が代入される
  //currentUserプロパティを使用して、現在サインインしているユーザーを取得する(サインインしていなければnull)
  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser: any) => {
      if (!currentUser) {
        console.log("ログアウト状態です");
      } else {
        setUser(currentUser);
        //ログイン判定が終わったタイミングでloadingはfalseに変わる
        setLoading(false);

        //コレクションへの参照を取得
        const userCollectionRef = collection(
          db,
          "user"
        ) as CollectionReference<User>;

        // //上記を元にドキュメントへの参照を取得
        const userDocRefId = doc(userCollectionRef, currentUser.uid);

        // //上記を元にドキュメントのデータを取得
        const userDocId = await getDoc(userDocRefId);
        console.log(userDocId);

        // //取得したデータから必要なものを取り出す
        const userDataId: any = userDocId.data();
        console.log(userDataId);
        setUsers(userDataId);

        if (!userDataId) {
          console.log("データがありません");
        } else {
          // setPostList(userDataId.post);
          setFollowList(userDataId.follow);
          setFollowerList(userDataId.follower);
          console.log(userDataId.name);
          console.log(userDataId.follow);
          console.log(userDataId.post);
        }

        //postコレクションへの参照を取得(userIdが一致しているドキュメントのみ)
        const postCollectionRef: any = query(
          collection(db, "post"),
          where("userId", "==", currentUser.uid)
        ) as CollectionReference<Post>;

        console.log(postCollectionRef); //Zcがひとつ

        // 上記を元にドキュメントのデータを取得(post)
        const postDocId: any = await getDocs(postCollectionRef);
        console.log(postDocId.docs); // 配列(3)[rl,rl,rl]
        console.log(postDocId); //ol

        //上記を元にデータの中身を取り出す。map()を使えるようにする。
        const newPostDocIds = postDocId.docs as any[];
        const postDataArray = newPostDocIds.map((id) => id.data());
        console.log(postDataArray); //(3)[{},{},{}]
        setPosts(postDataArray);
        console.log(posts); //[]
      }
    });
  }, []);

  // const navigate = useNavigate();

  // const forSearchPage = () => {
  //   navigate("/searchPage");
  // };

  // console.log(users.name);  //ここに書くとレンダリングされた時に実行されてundefinedになる
  console.log(posts); //postコレクションからuidと等しいドキュメントを取得したものが格納されている
  // console.log(postList); //userコレクションからログインユーザーの情報を取得して、post配列の中身だけ格納している
  console.log(followList);


  return (
    <>
      {/* loadingがfalseのときのみマイページを表示する設定。loadingがfalseのときのみ */}
      {!loading && (
        <>
          {/* ログインしていない状態でマイページ表示しようとするとログインページにリダイレクトする設定(!userがログインしていない場合のこと) */}
          {!user ? (
            <Navigate to={`/login`} />
          ) : (
            <>
              <Header show={true} />
              <div style={{textAlign: "center", fontSize: "20px", fontWeight: "bold"}}>
                <UserName users={users} />
              </div>
                {/* <div>{users.userName}</div> */}
                {/* <Link to={`/dmPage`}>
                  <button>DM</button>
                </Link> */}

              <div style={{display: "flex", justifyContent: "space-between", gap: "10%", margin: "10px 20px",  alignItems: "center"}}>
              <Icon />
              <MyPageInfo
              posts={posts}
              followerList={followerList}
              followList={followList}
              uid={user.uid}
              />
              </div>
              {/* <div> */}
                {/* <PostCount posts={posts} /> */}
                {/* <div>{posts.length}投稿</div> */}

                {/* <Link to={"/myFollower"}>
                  <div>{followerList.length}フォロワー</div>
                </Link> */}

                {/* <FollowerCount
                  followerList={followerList}
                  link={"/myFollower"}
                  uid={user.uid}
                /> */}

                {/* <FollowCount
                  followList={followList}
                  link={"/myFollow"}
                  uid={user.uid}
                /> */}
                {/* <Link to={"/myFollow"}>
                  <div>{followList.length}フォロー中</div>
                </Link> */}
              {/* </div> */}
              <span style={{fontWeight: "bold"}}>
                <Name users={users}/>
              </span>
              <div>{users.profile}</div>
              <MyPostList posts={posts} users={users} />
              <Footer />
            </>
          )}
        </>
      )}
    </>
  );
}

export default MyPage;
