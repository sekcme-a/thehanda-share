import { useEffect, useState } from "react"
import { firestore as db } from "firebase/firebase"
import { useRouter } from "next/router"
import { CircularProgress } from "@mui/material"
import styles from "../styles/family.module.css"
import ChildCareIcon from '@mui/icons-material/ChildCare';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { Button } from "@mui/material"
import { Dialog } from "@mui/material"
import { TextField } from "@mui/material"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const Family = ({uid}) => {
  const [memberList, setMemberList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [openDialog, setOpenDialog] = useState(false)
  const [openDialog2, setOpenDialog2] = useState(false)
  const [inputText, setInputText] = useState("")
  const [family, setFamily] = useState([])
  const [simpleFamilyData, setSimpleFamilyData] = useState([])
  const [list, setList] = useState([])

  const [selectedIndex, setSelectedIndex] = useState()
  const [selectedRelation, setSelectedRelation] = useState("children")

  const [isSearching, setIsSearching] = useState(false)



  useEffect(()=>{
    const fetchData = () => {
      return db.collection("user").doc(uid).get()
        .then((userDoc) => {
          if (userDoc.exists) {
            if (userDoc.data().family) {
              setSimpleFamilyData(userDoc.data().family);
              const promises = userDoc.data().family.map((item) => {
                return db.collection("user").doc(item.uid).get()
                  .then((itemDoc) => {
                    if (itemDoc.exists) {
                      return {
                        uid: item.uid,
                        relation: item.relation,
                        displayName: itemDoc.data().displayName,
                        realName: itemDoc.data().realName,
                        phoneNumber: itemDoc.data().phoneNumber
                      };
                    }
                  });
              });
              return Promise.all(promises.filter(Boolean))
                .then((family) => {
                  setFamily([...family]);
                  setIsLoading(false);
                });
            } else {
              setFamily([]);
              setIsLoading(false);
            }
          } else {
            alert("로그인 후 이용하실 수 있습니다.");
            router.push("/login");
            return Promise.reject();
          }
        })
        .catch((error) => {
          console.error(error);
          setFamily([]);
          setIsLoading(false);
        });
    };
    fetchData()
  },[simpleFamilyData])

  const onUserClick = (uid) => {
    router.push(`/user/${uid}`)
  }


  const onAddClick = () => {
    if(confirm("이 기능은 해당 사용자가 입력한 데이터를 바꾸는 것으로 해당 사용자에게 충분한 설명과 동의가 필요합니다."))
      setOpenDialog(true)
  } 
  const onDialogClose = () => {
    setIsSearching(false)
    setInputText("")
    setList([])
    setOpenDialog(false)
  }

  const onSearchClick = async() => {
    if(inputText==="" || inputText===" "){
      alert("검색할 내용을 입력해주세요")
      return;
    }
    setIsSearching(true)
    const query1 = await db.collection("user").where("displayName","==",inputText).get()
    const query2 = await db.collection("user").where("realName","==",inputText).get()
    // const query3 = await db.collection("user").where("phoneNumber","==",inputText).get()
    const temp1 = query1.docs.map(doc=>doc.data())
    const temp2 = query2.docs.map(doc=>doc.data())
    // const temp3 = query3.docs.map(doc=>doc.data())
    const temp4  = [...temp1, ...temp2]
    console.log(temp4)
    const result = temp4.reduce((acc, v) => {
      return acc.find(x => x.uid === v.uid) ? acc : [...acc, v];
    }, []);
    setList([...result])
    setIsSearching(false)
  }
  const handleOnKeyPress = e => {
    if (e.key === 'Enter') {
      onSearchClick();
    }
  };

  const onItemClick = (index)=>{
    // alert(list[index].uid)
    // if(confirm(`가족 구성원으로 추가하시겠습니까?\n닉네임:${list[index].displayName}\n실명:${list[index].realName}\n전화번호:${list[index].phoneNumber}`)){

    // }
    if(simpleFamilyData.some(member => member.uid===list[index].uid)){
      alert("이미 가족 구성원인 사용자입니다.")
    }else{
      setSelectedIndex(index)
      setOpenDialog2(true)
    }
  }

  const onDialog2Close = () => {
    setOpenDialog2(false)
    setSelectedRelation("children")
  }

  const onApplyClick = () => {
    let selectedRelationText = ""
    switch(selectedRelation){
      case "children":
        selectedRelationText="자녀"
        break
      case "spouse":
        selectedRelationText="배우자"
        break
      default:
        selectedRelationText="부모"
    }
    if(confirm(`가족 구성원으로 추가하시겠습니까?\n
    닉네임: ${list[selectedIndex].displayName}\n
    실명: ${list[selectedIndex].realName}\n
    전화번호: ${list[selectedIndex].phoneNumber?.replace(/\s/g, "").substring(0,6)}****${list[selectedIndex].phoneNumber?.replace(/\s/g, "").substring(10)}\n
    가족관계: ${selectedRelationText}`)){
      let family  = []
      if(family.length===0){
        family = [{relation:"me", uid: uid}, {relation: selectedRelation, uid: list[selectedIndex].uid}]
      }else{
        family = [...simpleFamilyData, {relation: selectedRelation, uid: list[selectedIndex].uid}]
      }
      db.collection("user").doc(uid).update({
        family: [...family]
      }).then(()=>{
        alert("가족 구성원이 추가되었습니다!")
        setSimpleFamilyData( [...simpleFamilyData, {relation: selectedRelation, uid: list[selectedIndex].uid}])
        onDialogClose()
        onDialog2Close()
      })
    }
  }

  const onDeleteClick = (uid) => {
    if(confirm("이 기능은 해당 사용자가 입력한 데이터를 바꾸는 것으로 해당 사용자에게 충분한 설명과 동의가 필요합니다.")){
      if(confirm("해당 구성원을 삭제하시겠습니까?")){
        const temp = simpleFamilyData.filter(member => member.uid !== uid);
        db.collection("user").doc(uid).update({
          family: [...temp]
        }).then(()=>{
          setSimpleFamilyData([...temp])
        })

      }
    }
  }


  if(isLoading)
    return(<div className={styles.loading_container}><CircularProgress/></div>)

  
  return(
    <>
    {!isLoading && family.length===0 &&
      <div className={styles.loading_container}>
        <p>등록된 가족 구성원이 없습니다.</p>
      </div>
    }
      <ul className={styles.container}>
        
        {family.map((item, index) => {
            return(
              <div className={styles.member_container} key={index}>
                {item.relation==="me" && <h1><PermIdentityIcon sx={{pr:"5px"}} />본인</h1>}
                {item.relation==="children" && <h1><ChildCareIcon sx={{pr:"5px"}} />자녀</h1>}
                {item.relation==="spouse" && <h1><FavoriteBorderIcon sx={{pr:'5px'}}/>배우자</h1>}
                {item.relation==="parents" && <h1><SupervisedUserCircleIcon sx={{pr:'5px'}}/>부모</h1>}
                <h3>{item.realName}<p>{`(${item.displayName})`}</p></h3>
                <h4>{item.phoneNumber}</h4>
                {item.relation!=="me" && <h5><Button size="small" sx={{p:"0 1px 0 1px", color:"rgb(200, 50, 50)"}} onClick={()=>onDeleteClick(item.uid)}>삭제</Button></h5>}
              </div>
            )
          })}
          <Button variant="contained" size="small" onClick={onAddClick} fullWidth sx={{mt:"20px"}}>해당 유저의 가족 구성원 추가 +</Button>
      </ul>     
      <Dialog open={openDialog} onClose={onDialogClose}>
        <div className={styles.dialog_container}>
          <h1>사용자 검색</h1>
          <p>가족 구성원으로 등록할 사용자를 닉네임 또는 실명을 통해 검색하세요.</p>
          <p>모든 글자를 정확히 입력해야 검색됩니다.</p>
          <div className={styles.search_container}>
            <SearchOutlinedIcon />
            <TextField
              placeholder="검색할 대상의 닉네임 혹은 실명을 입력해주세요."
              variant="standard" 
              onKeyDown={handleOnKeyPress}
              value={inputText}
              onChange={(e)=>setInputText(e.target.value)}
              fullWidth
            />
            <Button onClick={onSearchClick}>검색</Button>
          </div>
          {isSearching ? 
            <div className={styles.loader_container}>
              잠시만 기다려주세요.<CircularProgress style={{width:"20px", height:"20px"}}/>
            </div>
          :
            list.length===0 ? 
            <div className={styles.loader_container}>
              조회된 사용자가 없습니다.
            </div>
            :
            <ul className={styles.user_list_container}>
              <li className={styles.header}>
                <h2>닉네임</h2>
                <h3>실명</h3>
                <h4>전화번호</h4>
              </li>
              {list.map((item, index) => {
                return(
                  <li className={styles.item_container} key={index} onClick={()=>onItemClick(index)}>
                    <h2>{item.displayName}</h2>
                    <h3>{item.realName==="" ? "-":item.realName}</h3>
                    <h4>{item.phoneNumber==="" ? "-": `${item.phoneNumber?.replace(/\s/g, "").substring(0,6)}****${item.phoneNumber?.replace(/\s/g, "").substring(10)}`}</h4>
                  </li>
                )
              })}
            </ul>
          }
        </div>
      </Dialog>
      
      <Dialog open={openDialog2} onClose={onDialog2Close}>
        <div className={styles.dialog_container}>
          <h1>가족관계 선택</h1>
          <h2>{list[selectedIndex]?.realName}님 와의 가족관계를 선택해주세요.</h2>
          <FormControl fullWidth sx={{mt:"20px"}}>
            <InputLabel id="demo-simple-select-label">가족 관계</InputLabel>
            <Select
              id="select-family"
              value={selectedRelation}
              label="가족 관계"
              onChange={(e)=>{setSelectedRelation(e.target.value)}}
              size="small"
            >
              <MenuItem value="children">자녀</MenuItem>
              <MenuItem value="spouse">배우자</MenuItem>
              <MenuItem value="parents">부모</MenuItem>
            </Select>
          </FormControl>
          <div className={styles.button_container}>
            <Button style={{color:"#666"}} onClick={onDialog2Close}>취소</Button>
            <Button onClick={onApplyClick}>확인</Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default Family