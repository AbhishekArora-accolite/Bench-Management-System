import React, { useContext, useEffect, useState } from 'react'
import Navbar from './Navbar';
import SideBar from './SideBar';
import search from './Images/search.png'
import UpdateEmployee from './UpdateEmployee';
import AuthContext from './AuthContext';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AddEmployee from './AddEmployee';

export default function ManagerDashboard() {
  
  const authData = useContext(AuthContext)
  const [managerData, setManagerData] = useState({}); // for assigned locations of that manager
  const [searchValue, setSearchValue] = useState("");
  const[assignedLocation,setAssignedLocation]=useState({})
  const[empOnBench,setEmpOnBench]=useState()
  const navigate = useNavigate();
  const handleViewEmployee = (id) => {
    navigate("/viewEmployee");
  }

// const checkStatus = (emp) => {
//   let okStatus = false
//   let Keys=Object.keys(authData.appliedFilters);
 
// }

  const fetchManagerTable = async () => {
    try{
    //  / const Data = await axios.get(`http://localhost:2538/api/manager/get/1`); // ${authData.managerId} instead of 1
     
      const managerDetails=await axios.get(`http://localhost:2538/api/manager/get/${authData.managerId}`)
           .then((response) => {
            setManagerData(response.data)  ;                  
          });
      // const dtoDetails = await axios.get('http://localhost:2538/api/dto/get');
      // authData.setDtoData(dtoDetails.data);

      // const allBenchedEmp = await axios.get('http://localhost:2538/api/empdetails/get/benchedemployee');
      // setEmpOnBench(allBenchedEmp.data);

    }
    catch{
      console.log()
    }
  }
  const fetchNew =async ()=>{
    try{
      const allnewDto = await axios.post(
        "http://localhost:2538/api/dto/get/filterd",authData.requestDto
      );
      authData.setNewData(allnewDto.data);
    }
    catch {
      console.log();
    }
  }

  useEffect(()=>{
    fetchNew();
    fetchManagerTable();
       
  },[authData.requestDto])
  // useEffect(()=>{
  //   setLocations();
     
  // },[authData.requestDto])
 
  const setLocations=()=>{
      managerData.assignedLocation && managerData.assignedLocation.map((key)=>{
      console.log("id "+key.id+" "+key.locName); 
      if(key.id==1) authData.assignedLocation.gurugram=true;
      else if(key.id==2) authData.assignedLocation.bangalore=true;
      else if(key.id==3) authData.assignedLocation.hyderabad=true;
        
  })
 
  }
 
  // -------------Filtering Section---------------------------
  const allowLocation=(emp)=>{    
    if(emp.location==1 && authData.assignedLocation["gurugram"])return true;
    if(emp.location==2 && authData.assignedLocation["bangalore"])return true;
    if(emp.location==3 && authData.assignedLocation["hyderabad"])return true;    
  }
  const allowData=(emp)=>{
    //By default 
    if(emp.activeStatus === false) return false;
    if (!authData.checkFilter["skill"] && !authData.checkFilter["location"] && !authData.checkFilter["status"] && authData.experienceValue==1 && authData.benchTimeValue==1)
    return true;
    //for bench
    let okBench = false;
    if (authData.benchTimeValue <= emp.benchPeriod/30) {
    okBench = true;
    }
    // return okBench;
    //for exp
    let okExp = false;
    if (authData.experienceValue <= emp.experience) {
    okExp = true;
    }
    let Keys=Object.keys(authData.appliedFilters);
    let ok=true,okSkill=true,okLocation=false;
    let selectDataKey=Object.keys(authData.checkFilter);    
    //for skills   
        if(authData.checkFilter["skill"]){
          //iterate over the filters..
          Keys.forEach(filterKey => {
            if(filterKey!="gurugram" && filterKey!="hyderabad" && filterKey!="bangalore" &&
               filterKey!="active" && filterKey!="benched")
             {
              
              if(authData.appliedFilters[filterKey]===true && emp[filterKey]!=true)            
                 okSkill=false;
              if(!allowLocation(emp))
                 okSkill=false;
          }      
          });
        }   
    //for location    
      if(authData.checkFilter["location"]){
        //iterate over the filters..
        Keys.forEach(filterKey => {
            if((authData.assignedLocation["gurugram"] && filterKey==="gurugram" && authData.appliedFilters[filterKey] && (emp.location==1)) ||
            (authData.assignedLocation["bangalore"] && filterKey==="bangalore" && authData.appliedFilters[filterKey]===true && (emp.location==2) )||
            ( authData.assignedLocation["hyderabad"] && filterKey==="hyderabad" && authData.appliedFilters[filterKey]===true && (emp.location==3) ))            
               {             
                okLocation=true;
               }
        });
      }
     let okStatus=false;
     
      //for Active status
      if(authData.checkFilter["status"]){     
        Keys.forEach(filterKey => {
          if(allowLocation(emp))
          {if( (filterKey==="active" && authData.appliedFilters[filterKey]===true && (emp.benchStatus==false) ) ||
          (filterKey==="benched" && authData.appliedFilters[filterKey]===true && (emp.benchStatus==true) )  )         
             {          
              okStatus=true;
             }
          }          
      });
    }
     
  // okStatus = checkStatus(emp);
      
     if(authData.checkFilter["skill"] && authData.checkFilter["location"] && authData.checkFilter["status"])
     {return okSkill && okLocation && okStatus;}
     else if(authData.checkFilter["skill"] && authData.checkFilter["location"])
     {return okSkill && okLocation;}
     else if(authData.checkFilter["skill"] && authData.checkFilter["status"])
     {return okSkill && okStatus;}
     else if(authData.checkFilter["location"]  && authData.checkFilter["status"])
     {return okLocation && okStatus;}
     else if(authData.checkFilter["location"])
     {return okLocation;}
     else if(authData.checkFilter["skill"] )
     {return okSkill;}
     else if(authData.experienceValue>1){
      return okExp;
    }
    else if(authData.benchTimeValue>1 && okStatus)return okBench;
    else return okStatus;
 }
console.log("new Data "+JSON.stringify(authData.newData));
// console.log("exppppp "+authData.requestDto.experience+" "+authData.requestDto.benchPeriod);
console.log("request dto "+JSON.stringify(authData.requestDto))
// console.log("applied filters "+JSON.stringify(authData.appliedFilters))
console.log("manager data "+JSON.stringify(managerData))
// console.log("check filters "+JSON.stringify(authData.checkFilter))
// console.log("default data "+JSON.stringify(authData.defaultData))
  return (
    <div className="window">
      <div className='top'>
        <Navbar />
      </div>
      <div className='bottom'>
        <div className='bottom-left'>
          <SideBar />
        </div>
        <div className='bottom-right'>
          <div className='statistics'>
            <p>STATISTICS</p>
          </div>
          <div className="row">
            <div className="col-sm-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Employees On Bench</h5>
                  <p className="card-text">{authData.dtoData && authData.dtoData.filter(key=> (allowLocation(key) == true && key.benchStatus == 1)).length}</p>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Recently removed From Bench</h5>
                  <p className="card-text">{authData.dtoData && authData.dtoData.filter(key=> (allowLocation(key) == true && key.benchStatus == 0)).length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='actions'>
            <p className='employees'>EMPLOYEES</p>
            <div className='buttons-manager-dashboard'>
              <AddEmployee />
              <form className="d-flex" role="search">
                <input className="search-box1" type="text" onChange={(e) => setSearchValue(e.target.value.toLowerCase())} value={searchValue} placeholder=" search by name " aria-label="Search" />
                <img className="search" src={search} alt="search-img" />
              </form>
            </div>
          </div>
          <div className='number'>
            <p> </p>
          </div>
          <div className='table'>
            <div className='table-format'>
              <table className="table">
                <thead className='thread1'>
                  <tr className='tableHeader'>
                    <th scope="col">Id</th>
                    <th className="table-align-left" scope="col">Name</th>
                    <th className="table-align-left" scope="col">Location</th>
                    <th className="table-align-left" scope="col">Bench-Status</th>
                    <th className="table-align-left" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody className='thread1'>
                {authData.dtoData &&
                  authData.dtoData.map((emp)=>(
                    allowData(emp)==true && (searchValue == "" || emp.employeeName.toLowerCase().includes(searchValue)) ?
                  (<tr>
                      <th className='pointer-to-profile' title="Click on ID to view profile" scope="row" onClick={() => {handleViewEmployee(emp.employeeId); authData.handleEmpId(emp.employeeId); }} >{emp.employeeId}</th>
                      <td className="table-align-left">{emp.employeeName}</td>
                      <td className="table-align-left">{emp.location==1?"Gurugram":emp.location==2?"Bangalore":emp.location==3?"Hyderabad":"none"}</td>
                      <td className="table-align-left">{emp.benchStatus==0?"Removed From Bench":"On Bench"}</td>
                      <td className="table-align-left"><UpdateEmployee id = {emp.employeeId}/></td> 
                 </tr>)
                 :
                 (<tr></tr>)
                         
                  ))
        
                 }
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
