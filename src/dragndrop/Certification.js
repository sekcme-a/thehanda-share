


const Certification = ({title, subtitle}) => {



  return(
    <div style={{width:'180px', height:'135px', backgroundColor:"white", borderRadius: "15px", border: "7px solid black", display:"flex", justifyContent:"center", alignItems:"center"}}>
      <div style={{width:"150px", height:'105px', border:"3px solid rgb(200,200,200)", borderRadius:"5px", display:"flex", justifyContent:"center",alignItems:"flex-start", flexWrap:"wrap"}}>
        <div style={{width:"100%",height:"11px", display:"flex", justifyContent:"center",}} >
          <div style={{width:"44px", height:"11px", backgroundColor:"black", marginTop: "12px"}}></div>
        </div>
        <h3 style={{fontSize:'20px', fontWeight:"900", width:"100%", textAlign:"center", wordBreak:"keep-all" ,marginTop: '5px'}}>{title}</h3>
        <h4 style={{fontSize:"10px", fontWeight:"bold", textAlign:"center"}}>{subtitle}</h4>
      </div>
    </div>
  )
}

export default Certification