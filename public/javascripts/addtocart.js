let thisprice = document.getElementById("thisprice");
console.log(thisprice.innerHTML);
let arrayoptions = [];
let priceformenu = document.getElementById("presentprice");
console.log(priceformenu.innerHTML);
let menutocart;
let order;
let menu;
let arrorder = [];
let optionarr = [];

//ลดจำนวนจาน
function poporder() {
  if (parseInt(count.value) === 1) {
    console.log('con not change');
  } else {
    count.value = parseInt(count.value) - 1;
    //console.log(count.value);
    allprices = parseInt(thisprice.innerHTML) * parseInt(count.value);
    priceformenu.innerHTML = allprices;
  }
}

//เพิ่มจำนวนจาน
function pushorder() {
  count.value = parseInt(count.value) + 1;
  console.log(count.value);
  allprices = parseInt(thisprice.innerHTML) * parseInt(count.value);
  priceformenu.innerHTML = allprices;
}

let allprices;

let count = document.getElementById("countorder");
console.log(count.value);

function sendtocart() {
  menu = null;
  let menuid = document.getElementById("menuid").value;
  console.log("MenuID >>" + menuid);
  let set = document.getElementById("countorder").value;
  console.log("set >> " + set);
  let optionid = document.querySelectorAll("#optionid").value;
  let comment = document.getElementById("comment").value;
  console.log("comment >> " + comment);
  let tableid = document.getElementById("tableid").innerHTML;
  console.log("table id ", tableid);
  let checkboxes = document.querySelectorAll("#flexCheckDefault");
  checkboxes.forEach(
    (checkbox) => {
      if (checkbox.checked) {
        //console.log(`Checkbox with value ${checkbox.value} is checked`);
        let opt = checkbox.value.split(",");
        console.log("splte", opt);
        //optionarr.push(checkbox.value);
        let option = {
          id: opt[0],
          name: opt[1],
          price: opt[2]
        }
        arrayoptions.push(option);
      } else {
        console.log('--');
        //console.log(`Checkbox with value ${checkbox.value} is not checked`);
      }
    }
  );
  console.log("option", arrayoptions);
  let menuprice = thisprice.innerHTML;
  let menuname = document.getElementById("menuname").innerHTML;
  let ppp = document.getElementById("presentprice").innerHTML;

  menu = {
    tableid: parseInt(tableid),
    menuid: menuid,
    menuname: menuname,
    menuprice: menuprice,
    set: parseInt(set),
    option: arrayoptions,
    comment: comment,
    totalprice: parseInt(ppp)
  }

  console.log("for send data >> ", menu);
  addtocart(menu);
  arrayoptions = [];
}


//กดลงตะกต้า
function addtocart(data) {
  const url = '/customer/addmenutocart';
  console.log("data >> ", data);
  const options = {
    method: 'POST',
    json: true,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  };

  fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      Swal.fire({
        title: 'สำเร็จ!',
        text: 'สั่งอาหารเรียบร้อย',
        icon: 'success',
        confirmButtonText: 'กลับ'
      })
      
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
}


