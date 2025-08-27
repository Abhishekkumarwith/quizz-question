const scoreResult = document.querySelector('.score')
const progressValue = document.querySelector('.green-value')
const retryBtn = document.querySelector('.retry-btn .btn')
const animate=document.querySelector('.animeted')

function getQueryParams() {
  const params = new URLSearchParams(location.search)
  const score =parseInt( params.get('score'))
  const total=parseInt(params.get('total'))
 return {score,total}
}

const { score, total } = getQueryParams()
 scoreResult.innerText=`You Scored ${score} out of ${ total}`


const percent = Math.round((score / total) * 100)
 
//update progress bar

progressValue.style.width = percent + '%'

//you can back question page 
retryBtn.addEventListener('click', () => {
  location.replace('index.html')

})


setTimeout(() => {
  progressValue.style.width = percent + "%";
}, 1000);


