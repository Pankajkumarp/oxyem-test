export const isValidEmail = (inputEmail) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(inputEmail);
};

/*****************Leave Common functions******************/


export  const updateFieldValue = (AdduserContent, sectionName, subsectionName, NumberofDays, RemainingLeaves,getvalue, leaveType = "") => {  

const updatedFormData = { ...AdduserContent };       

const section = updatedFormData.section.find(sec => sec.SectionName === sectionName);     

if (section) {
    const subsection = section.Subsection.find(sub => sub.SubsectionName === subsectionName);
   
    if (subsection) {
       
            const fromdatefield = subsection.fields.find(fld => fld.name === "fromDate");               
            if (fromdatefield) {
                fromdatefield.value = getvalue.fromDate;                  
            }
            const todatefield = subsection.fields.find(fld => fld.name === "toDate");  
            if(leaveType != "" && leaveType == "Birthday" ){                     
              //  console.log("check11",getvalue)
                const todatefield = subsection.fields.find(fld => fld.name === "toDate");               
                if (todatefield ) {
                    todatefield.value = getvalue.fromDate;    
                    todatefield.otherAttributes =  [{"name": "disabled","value": true }]             
                }
            }else if(leaveType != "Birthday"){             
                if (leaveType == "Maternity" || leaveType == "Paternity") {
					todatefield.value = getvalue.toDate;
					todatefield.otherAttributes = [{ "name": "disabled", "value": true }]
				} else {
					if (todatefield) {
						todatefield.value = getvalue.toDate;
						todatefield.otherAttributes = []
					}
				}
             }
            const NumberofDaysfield = subsection.fields.find(fld => fld.name === "numberofDays");               
            if (NumberofDaysfield) {
                NumberofDaysfield.value = NumberofDays;                  
            }
            const RemainingLeavesfield = subsection.fields.find(fld => fld.name === "remaingLeaves");
            if (RemainingLeavesfield) {
                RemainingLeavesfield.value = RemainingLeaves;                    
            }
            const LeaveReasonfield = subsection.fields.find(fld => fld.name === "leaveReason");               
            if (LeaveReasonfield) {
                if(getvalue.leaveReason != "" && getvalue.leaveReason != undefined){
                LeaveReasonfield.value = getvalue.leaveReason;   
                }           
            }
            const leaveTypefield = subsection.fields.find(fld => fld.name === "leaveType");               
            if (leaveTypefield.value) {                       
                    
                    leaveTypefield.value = getvalue.leaveType.value != "" && getvalue.leaveType.value != undefined  ? getvalue.leaveType.value :getvalue.leaveType ;   
                   
            }
            /*const idEmployeefield = subsection.fields.find(fld => fld.name === "idEmployee");               
            if (idEmployeefield.value) {                       
                    
              idEmployeefield.value = getvalue.idEmployee.value != "" && getvalue.idEmployee.value != undefined  ? getvalue.idEmployee.value :getvalue.idEmployee ;   
                   
            }*/
           
       return updatedFormData
    }
}
}; 
export const getleaveoptionchange = async(getcurrentformdata,getformdata) => {
  //console.log(getcurrentformdata);
let leaveType = ""
if ( getcurrentformdata.leaveType != undefined  && typeof  getcurrentformdata.leaveType === 'object' && getcurrentformdata.leaveType !== null && !Array.isArray( getcurrentformdata.leaveType)) {
   leaveType = getcurrentformdata.leaveType.value
}else if( getcurrentformdata.leaveType !== null && getcurrentformdata.leaveType != undefined && typeof  getcurrentformdata.leaveType === 'string'){
     leaveType = getcurrentformdata.leaveType
}        
let idEmployee = ""
if ( getcurrentformdata.idEmployee != undefined  && typeof  getcurrentformdata.idEmployee === 'object' && getcurrentformdata.idEmployee !== null && !Array.isArray( getcurrentformdata.idEmployee)) {
  idEmployee = getcurrentformdata.idEmployee.value
}else if( getcurrentformdata.idEmployee !== null && getcurrentformdata.idEmployee != undefined && typeof  getcurrentformdata.idEmployee === 'string'){
  idEmployee = getcurrentformdata.idEmployee
}    

return  {leaveType,getformdata,idEmployee}

}

export const getFieldByName = async(form, fieldName) => {
  let fieldValues = "";
 // console.log("rrrr",form)
  // Iterate through each subsection
  form.forEach(subsection => {
      // Find the field with the given name
      const field = subsection.fields.find(field => field.name === fieldName);
      
      // If the field is found, add its value to the array
      if (field) {
          fieldValues = field.value;
      }
  });
  
  return fieldValues;
}



export  const updatedSubsection =async(form, fieldName,newValue) => {
  const updfield = form.Subsection.map(subsection => {       
      if (subsection.fields.some(field => field.name === fieldName)) {
          // Update the value of the field
          subsection.fields = subsection.fields.map(field => {
              if (field.name === fieldName) {
                  return { ...field, value: newValue };
              }
              return field;
          });
      }
      return subsection;
  });
  return updfield
}
export const transformData = (leaves, labels) => {
 
return leaves.map((leave,index) => {    
  return [
   { "name": 'srNo', "value": index+1 },
   { "name": "id", "value": leave.idLeave }, 
    { "name": labels.find(label => label.name === "employeeName") ? labels.find(label => label.name === "employeeName").name :"", "value": leave.employeeName },
    { "name": labels.find(label => label.name === "leaveType").name, "value": leave.leaveType },
    { "name": labels.find(label => label.name === "fromDate").name, "value": leave.fromDate },
    { "name": labels.find(label => label.name === "toDate").name, "value": leave.toDate },
    { "name": labels.find(label => label.name === "numberofDays").name, "value": leave.numberofDays },
   // { "name": labels.find(label => label.name === "remaingLeaves").name, "value": leave.remaingLeaves },
    { "name": labels.find(label => label.name === "leaveReason").name, "value": leave.leaveReason },
    { "name": labels.find(label => label.name === "status") != undefined? labels.find(label => label.name === "status").name:"", "value": leave.status },
        
  ];
});
};
export const transformLabels = (labelsArray) => {
  return labelsArray.reduce((acc, label) => {
    acc[label.name] = label.lebel;
    if(label.name == "idLeave"){
      acc[options] ={ display: 'excluded'};
    }
    return acc;
  }, {});
};

export const removeFields = (data, fieldsToRemove, buttonsToRemove) => {
  return {
      ...data,
      section: data.section.map(section => ({
          ...section,
          Subsection: section.Subsection.map(subsection => ({
              ...subsection,
              fields: subsection.fields.filter(field => {
                  // Add conditional logic here if needed
                  if (fieldsToRemove.includes(field.name)) {
                      // You can add more conditions here if required
                      return false; // Remove this field
                  }
                  return true; // Keep this field
              })
          })),
          // Filter buttons based on buttonsToRemove array
          buttons: section.buttons.filter(button => !buttonsToRemove.includes(button.value))
      }))
  };
};




   export const    updateFieldValuearr = async(fieldName, attributeName, newValue, jsonObject)=> {
    
      function updateField(section) {
          if (section.fields) {
              section.fields.forEach(field => {
                  if (field.name === fieldName) {
                      field[attributeName] = newValue;
                  }
              });
          }
  
          // Recursively update subsections
          if (section.Subsection) {
              section.Subsection.forEach(subsection => updateField(subsection));
          }
      }
  
      // Check if jsonObject has section and iterate over each section to update the field
      if (jsonObject.section) {
          jsonObject.section.forEach(section => updateField(section));
      }
  
      return jsonObject;
      }
     
    export   const reorderColumns = async(tablecolumn, modulename ) => {
          if(modulename  == 'leave'){
          const srNo = tablecolumn.find(column => column.name === "srNo");
          const idcl = tablecolumn.find(column => column.name === "id");
          let actions = tablecolumn.find(column => column.name === "action");          
          
          const remainingColumns = tablecolumn.filter(column => column.name !== "srNo" && column.name !== "id" && column.name !== "action");
          return [srNo, idcl, ...remainingColumns,actions]; 
        }
          
      };
      export const reorderEntries = async(entries,modulename) => {
        if(modulename == "leave"){
        return entries.map(entry => {
            const id = entry.find(item => item.name === "id");
            const srNo = entry.find(item => item.name === "srNo");
            let  actions = entry.find(item => item.name === "action");
            const rest = entry.filter(item => item.name !== "id" && item.name !== "srNo" && item.name !== "action");
            
            return [srNo,id,  ...rest,actions];
        });
      }
    };    

    export  const sortData = async(data, tablecolumn) => {
      const sortedData = [];

      data.forEach(item => {
          const filteredItem = item.filter(field => tablecolumn.some(order => order.name === field.name));
          sortedData.push(filteredItem);
      });

      return sortedData

  
      }

      export const  formFieldEditCase = async(leaveFormdata,newValues)=> {
          let updatedConfig = { ...leaveFormdata }; // Ensure updatedConfig is a copy of leaveFormdata
   
      newValues.forEach(newValue => {
        updatedConfig.section.forEach(section => {
          section.Subsection.forEach(subsection => {
            subsection.fields.forEach(field => {
              if (field.name === newValue.name) {
                field.value = newValue.attributeValue;
              }
            });
          });
        });
      });
      return updatedConfig
      }

     export  const compareDates = async(d1, d2) => {
        let msg =""
            if (d1 && d2) {
              const date1 = new Date(d1);
              const date2 = new Date(d2);
              if (date1 > date2) {
                msg  = 'To date should be greater than or equal to from date';
              } else {
                msg  = ""
              }
            }
            return msg
          };
          const toLowerCaseObject = (obj) => {
            const newObj = {};
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                newObj[key.toLowerCase()] = obj[key].toLowerCase();
              }
            }
            return newObj;
          };  
          
          
  