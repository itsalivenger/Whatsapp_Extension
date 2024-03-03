let data = [];
const second = 1000;
let index = 0;
let stage1Index = 0;
let statusNumber = 0;
let currentStatus = 0;
let working;
let absIndex = 0;
onload = () => {
  injectOverlay();
  addEventListener("keydown", (e) => {
    if (e.key == "i" && e.ctrlKey && !working) {
      console.log("starting");
      toggleOverlay();
      working = true;
      stage1();
    }

    if(e.key == "y" && e.ctrlKey){
      stage1Index = 0;
      index = 0;
      working = false;
      absIndex = 0;
    }
  });
};

function overall() {
  let usersList = document.getElementsByClassName("_3YS_f _2A1R8")[0].getElementsByClassName('_199zF _3j691');
  if(absIndex <= usersList.length - 1){
    usersList[absIndex].click();
    analyseStatus();
  }else{
    console.log("stage 2");
    // stage2();
  }
}

function analyseStatus() {
  let statusTrackerContainer = document.getElementsByClassName("lhggkp7q ebjesfe0 tkdu00h0 nbczt5ty p357zi0d bmhhosgr c46o30wg k1jo73ug isfiuinm btzd6xh9 hblzrxh7")[0];
  setTimeout(()=>{
    if(statusTrackerContainer){
      statusNumber = statusTrackerContainer.children.length;

      trackStatusChange();
    }else{
      analyseStatus();
    }
  }, second / 4);
}











function stage1() {
  let usersList = document.getElementsByClassName("_3YS_f _2A1R8")[0].getElementsByClassName('_199zF _3j691');
  console.log(stage1Index, usersList.length);
  if(stage1Index <= usersList.length - 1){
    usersList[stage1Index].click();
    getStatNum();
  }else{
    console.log("stage 2");
    stage2();
  }
}

function getStatNum() {
  let statusTrackerContainer = document.getElementsByClassName("lhggkp7q ebjesfe0 tkdu00h0 nbczt5ty p357zi0d bmhhosgr c46o30wg k1jo73ug isfiuinm btzd6xh9 hblzrxh7")[0];
  setTimeout(()=>{
    if(statusTrackerContainer){
      statusNumber = statusTrackerContainer.children.length;

      trackStatusChange();
    }else{
      getStatNum();
    }
  }, second / 4);
}



function trackStatusChange() {
  const targetElement = document.getElementsByClassName("lhggkp7q qq0sjtgm tkdu00h0 bgigc5s4 ln8gz9je ppled2lx ss9a15xu")[0].lastChild;
  let times = 0;
  let done;

  const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            currentStatus++;
            times = 0;
            
            if(Math.ceil((currentStatus - 2) / 9) == statusNumber - 1 && !done){
              done = true;
              finalize(interval, observer);
            }
          }
      });
  });
  
  let interval = setInterval(() => {
    let statusMediaHtml = document.getElementsByClassName("_2pktu")[0];
    if(statusMediaHtml.querySelector("video")){
      statusMediaHtml.querySelector("video").muted = true;
    }
    times++;
    if(times > 15 || isSkippableImg(statusMediaHtml)){
      times = 0;
      let nextBtn = document.getElementsByClassName("lhggkp7q qq0sjtgm d4vkij7k jxacihee tpju1xx5 qsdp9nde ohuqqxaf m3ct2rho ec1z5skj ajgl1lbb ss9a15xu g9p5wyxn i0tg5vk9 aoogvgrq o2zu3hjb tvdi1vrc")[0];

      if(nextBtn){
        nextBtn.click();
        clickMuteBtn();
      }else if(!done){
        done = true;
        finalize(interval, observer);
      }
    }
  }, second / 2);

  const config = { childList: true, subtree: true };

  observer.observe(targetElement, config);

}

function isSkippableImg(ele) {
  if(ele.querySelector("img")){
    if(ele.parentElement.parentElement.parentElement.querySelectorAll("img")[1].src.startsWith("blob")){
      return true;
    }
  }
  return false;
}

function finalize(interval, observer) {
  observer.disconnect();
  setTimeout(() => {
    stage1Index++;
    closeStatusInt();
    currentStatus = 0;
    clearInterval(interval);
    console.log("finalize");
    setTimeout(stage1, second / 2);
  }, second);
}

function stage2() {
  let statusUsersList = document.getElementsByClassName("_3YS_f _2A1R8")[0].getElementsByClassName('_199zF _3j691');
  if(index <= statusUsersList.length - 1){
    getLinksForUser(statusUsersList[index]);
  }else{
    toggleOverlay();
    downloadUsersAsJSON(data);
    console.log("doooone !!!");
  }
}

function getLinksForUser(user) {
  data.push({
    user: user.querySelector("._21S-L").innerText,
    urls: []});
  user.click();
  waitForStatusInterface();
}

function waitForStatusInterface(){
  let statusInterface = document.getElementsByClassName("_2pktu")[0];
  if(statusInterface){
    getUrlsProcess();
  }else{
    setTimeout(waitForStatusInterface, second / 3);
  };
}

async function getUrlsProcess() {
  await pauseStatus();
  setTimeout(async () => {
    let statusMediaHtml = document.getElementsByClassName("_2pktu")[0];
    let url = "";
    if(statusMediaHtml){
      
      if(statusMediaHtml.querySelector("video")){
        url = statusMediaHtml.querySelector("video").src;
        statusMediaHtml.querySelector("video").muted = true;
      }else if(statusMediaHtml.querySelector("img")){
        url = statusMediaHtml.parentElement.parentElement.parentElement.querySelectorAll("img")[1].src;
      }
      data[index].urls.push(url);
      let nextBtn = document.getElementsByClassName("lhggkp7q qq0sjtgm d4vkij7k jxacihee tpju1xx5 qsdp9nde ohuqqxaf m3ct2rho ec1z5skj ajgl1lbb ss9a15xu g9p5wyxn i0tg5vk9 aoogvgrq o2zu3hjb tvdi1vrc")[0];
      if(nextBtn){
        await goNextStatus(nextBtn);
        setTimeout(getUrlsProcess, second);
      }else{
        index++;
        closeStatusInt();
        console.log(data);
        stage2();
      }
    }
  }, second / 2);
}

function goNextStatus(nextBtn) {
  return new Promise(resolve =>{
      nextBtn.click();
    resolve();
  })
}

async function closeStatusInt() {
    let closeBtn = document.getElementsByClassName("lhggkp7q q177n8ra n642r0m2 b9fczbqn lxozqee9")[0];
      return new Promise(resolve => {
        if(closeBtn){
          closeBtn.click();
        }
        setTimeout(() => {
            resolve();
        }, second / 2);
      });
}

function pauseStatus() {
    return new Promise(resolve=>{
      setTimeout(async () => {
          clickNextBtn();
          resolve();
      }, second / 2);
    })
}

function clickMuteBtn() {
  // check if current status is a video then just use videoId.muted = true
}

function clickNextBtn() {
  let pauseBtn = document.getElementsByClassName(
    "i5tg98hk f9ovudaz przvwfww gx1rr48f shdiholb phqmzxqs gtscxtjd ajgl1lbb thr4l2wc fl2x09zf r2wk4q3o nnij903c lr2nq6lc"
    )[0]
    .children[0];
    pauseBtn.click();
    setTimeout(() => {
      if(pauseBtn.dataset.icon !== 'status-media-controls-play'){
        clickNextBtn();
      }
    }, second / 2);
}

function isVid(ele) {
    if(ele.querySelector("video"))
        return true;
    else return false;
}

function isImg(ele) {
    if(ele.querySelector("img"))
        return true;
    else return false;
}


function injectOverlay() {
  // Create overlay div
  var overlayDiv = document.createElement('div');
  overlayDiv.id = 'overlay';
  
  // Create text element for overlay
  var overlayText = document.createElement('div');
  overlayText.id = 'overlay-text';
  overlayText.textContent = 'Loading...';

  // Append text element to overlay div
  overlayDiv.appendChild(overlayText);

  // Add styles for overlay
  overlayDiv.style.position = 'fixed';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.width = '100%';
  overlayDiv.style.height = '100%';
  overlayDiv.style.zIndex = "100";
  overlayDiv.style.backgroundColor = 'rgb(0, 0, 0, .5)';
  overlayDiv.style.display = 'none'; // Initially hidden
  overlayDiv.style.justifyContent = 'center';
  overlayDiv.style.alignItems = 'center';
  overlayText.style.color = 'white';
  overlayText.style.fontSize = '24px';

  // Append overlay div to document body
  document.body.appendChild(overlayDiv);
}

// Function to toggle the overlay visibility
function toggleOverlay() {
  var overlayDiv = document.getElementById('overlay');
  if (overlayDiv.style.display === 'none') {
      overlayDiv.style.display = 'flex';
  } else {
      overlayDiv.style.display = 'none';
  }
}

function downloadUsersAsJSON(users, filename = 'urls.json') {
  // Convert the array to JSON format
  const usersJSON = JSON.stringify(users, null, 4);

  // Create a Blob object with the JSON data
  const blob = new Blob([usersJSON], { type: 'application/json' });

  // Create a link element
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;

  // Programmatically click the link to trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
}
