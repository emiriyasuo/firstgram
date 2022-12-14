import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Footer from "../organisms/Footer";
import Header from "../organisms/Header";
import { auth, db } from "../../firebase";
import ThreeRowsPostList from "../molecules/ThreeRowsPostList";
import { Post, User } from "../../types/types";
import BackBtn from "../atoms/button/BackBtn";

function KeepList() {
  //keepPostsの中に入っているpostIdを元にpostのimageUrl取得
  //LinkのPostDetailsに渡すstateはpostIdとその投稿のuserId
  //posts

  //ログインユーザー
  const [user, setUser] = useState<any>("");

  const [loading, setLoading] = useState(true);

  //ログインユーザーの情報の中からkeepPostsを格納
  const [keepPostIds, setKeepPostIds] = useState([]);

  const [keepPosts, setKeepPosts] = useState<Post[]>([]);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser: any) => {
      setUser(currentUser);
      setLoading(false);

      //ログインユーザーのkeepPosts配列をkeepListに格納
      const userCollectionRef = collection(db, "user")as CollectionReference<User>;

      const userDocRefId = doc(userCollectionRef, currentUser.uid);

      const userDocId = await getDoc(userDocRefId);

      const userKeepList = userDocId.get("keepPosts");
      setKeepPostIds(userKeepList);

      //この方法だと2回に１回ぐらいひとつしか表示されない
      // const keepArray: any = [];

      // userKeepList.map(async (keepPostId: any) => {
      //   const keepPostCollectionRef = collection(db, "post");

      //   const keepPostsDocRefId = doc(keepPostCollectionRef, keepPostId);

      //   const keepPostDocId = await getDoc(keepPostsDocRefId);

      //   const keepPostDataId = keepPostDocId.data();

      //   keepArray.push(keepPostDataId);
      //   setKeepPosts(keepArray);
      // }); //map

      const postCollectionRef = query(
        collection(db, "post"),
        where("keeps", "array-contains", currentUser.uid)
      )as CollectionReference<Post>;

      

      const keepPostDocId = await getDocs(postCollectionRef);
    

      const newKeepPostDocIds = keepPostDocId.docs as QueryDocumentSnapshot<Post>[];
      const keepPostArray = newKeepPostDocIds.map((doc) => doc.data());
      setKeepPosts(keepPostArray);
    }); //onAuth
  }, []);


  return (
    <>
      {!loading && (
        <>
          <Header show={true} />
          <BackBtn />
          <ThreeRowsPostList
            posts={keepPosts}
            message={<p>保存済みの投稿はありません</p>}
          />
          <Footer />
        </>
      )}
    </>
  );
}

export default KeepList;
