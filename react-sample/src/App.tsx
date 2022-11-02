import React from 'react';
import Input from './component/atoms/Input';
import { db } from './firebase';
import Icon from './component/atoms/Icon';
import { useEffect, useState } from 'react';
import {collection, getDocs} from 'firebase/firestore';

function App() {

    const [users,setUsers] = useState<any[]>([]);

    useEffect(()=>{
      const userCollectionRef = collection(db, 'user');
      // console.log(userCollectionRef);
      getDocs(userCollectionRef).then((querySnapshot)=>{
        // console.log(querySnapshot);
        // querySnapshot.docs.forEach((doc)=>console.log(doc));
        //保存しているフィールドのデータのみ取得する↓
        // querySnapshot.docs.forEach((doc)=>console.log(doc.data()));
        setUsers(querySnapshot.docs.map((doc)=>({...doc.data(), id:doc.id})));
      });
    },[]);



  return (
    <div>
      <div>
        <p>Inputコンポーネント</p>
        <Input inputType="search" inputPlaceholder="検索" buttonType="button" buttonName="検索" />
      </div>
      <hr />
      <div>
        <p>Iconコンポーネント</p>
        <Icon />
      </div>
      <hr />

      <div>
        {users.map((user)=>(
          <div key={user.id}>
          <img src={user.icon} alt="icon" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
