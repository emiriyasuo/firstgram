import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Mypage from "./Mypage";
import NewPost from "./NewPost";
import AccountEditPage from "./AccountEditPage";
import AccountSettingPage from "./AccountSettingPage";
import "./index.css"
import Top from "./Top";
import Follow from "./Follow";
import Follower from "./Follower";
import PostDetails from "./PostDetails";
import PostLook from "./PostLook";
import DeleteCompPage from "./DeleteCompPage";
import PsswordChange from "./PsswordChange"
import PostEditing from "./PostEditing";

function App() {
  return (
    <div className="App">
      <div className="container">
        <BrowserRouter>
          <Routes>
            <Route path={`/mypage/`} element={<Mypage />} />
            <Route path={`/register/`} element={<Register />} />
            <Route path={`/login/`} element={<Login />} />
            <Route path={`/AccountEditPage`} element={<AccountEditPage />} />
            <Route path={`/AccountSettingPage`} element={<AccountSettingPage />} />
            <Route path={`/`} element={<Top />} />
            <Route path={`/newPost`} element={<NewPost />} />
            <Route path={`/follow`} element={<Follow />} />
            <Route path={`/follower`} element={<Follower />} />
            <Route path={`/PostDetails`} element={<PostDetails />} />
            {/* <Route path="/PostDetails" component={PostDetails} /> */}
            <Route path={`/PostLook`} element={<PostLook />} />
            <Route path={`/deleteComp`} element={<DeleteCompPage />} />
            <Route path={`/passwordChange`} element={<PsswordChange />} />
            <Route path={`/PostEditing`} element={<PostEditing />} />
          </Routes>
        </BrowserRouter>
      </div>
      </div>
  );
}

export default App;
