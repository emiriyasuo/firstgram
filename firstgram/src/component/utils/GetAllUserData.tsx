import { getAuth } from "firebase/auth";
import { collection, query, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { onAuthStateChanged } from "@firebase/auth";
import { db } from "../../firebase";
import { DocumentData } from "firebase/firestore";

export function GetAllUserData(propsSetFnc: any) {

  const allUserDataArr: DocumentData[] = []

  const auth = getAuth();
  // まずuseEffect内で前userデータのuserNameとnameとtonametouserIdを取得
  useEffect(() => {
    let ignore = false;
    //ログイン判定
      onAuthStateChanged(auth, (user) => {
        if (!user) {
        <></>
        } else {
          if (!ignore) {
            const userQuery = query(collection(db, "user"));
  
            getDocs(userQuery).then((data) => {
              data.forEach((docdata) => {
                const data = docdata.data();
                allUserDataArr.push(data);
              });
              propsSetFnc(allUserDataArr);
            });
          }
        }
      })
    return () => {
      ignore = true;
    };
  }, []);

}
