import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

// ドキュメント名を引数に取る
// interface Props {
//     docName: string
//   }

// export async function GetUsersData({ docName }:Props) {
//   const usersRef = doc(db, "users", `${docName}`);
//   const docSnap = await getDoc(usersRef);

//   return (
//   if (docSnap.exists()) {
//     console.log("Document data:", docSnap.data());
//   } else {
//     // doc.data() will be undefined in this case
//     console.log("No such document!");
//   }
//   )
// }