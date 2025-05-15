console.log("Welcome to Audify");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio('songs/1.mp3');
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));

let songs = [
    {songName: "AAj BHi Song-Vishal Mishra", filePath: "songs/1.mp3", coverPath: "covers/1.jpg"},
    {songName: "Chali Kahani Song_A R Rahman", filePath: "songs/2.mp3", coverPath: "covers/2.jpeg"},
    {songName: "Dil Meri Na Sune Song_Atif Aslam", filePath: "songs/3.mp3", coverPath: "covers/3.jpg"},
    {songName: "Lo maan liya Song _Arijit Singh", filePath: "songs/4.mp3", coverPath: "covers/4.jpeg"},
    {songName: "RETRO - GULL AINAA  Song_Hriday Gattani", filePath: "songs/5.mp3", coverPath: "covers/5.jpeg"},
    {songName: "Tu hi hai aashiqui Song_Arijit Singh", filePath: "songs/6.mp3", coverPath: "covers/6.jpg"},
    {songName: "Zara Sa Song_KK _ Pritam", filePath: "songs/7.mp3", coverPath: "covers/7.jpg"},
];

// Update song items with correct cover and name
songItems.forEach((element, i) => {
    if (songs[i]) {
        element.getElementsByTagName("img")[0].src = songs[i].coverPath;
        element.getElementsByClassName("songName")[0].innerText = songs[i].songName;
    }
});

// Handle play/pause click
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play();
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
});

// Listen to Events
audioElement.addEventListener('timeupdate', () => {
    // Update Seekbar
    let progress = 0;
    if (audioElement.duration) {
        progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    }
    myProgressBar.value = progress;
});

myProgressBar.addEventListener('change', () => {
    if (audioElement.duration) {
        audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
    }
});

const makeAllPlays = () => {
    Array.from(document.getElementsByClassName('songItemPlay')).forEach((element) => {
        element.classList.remove('fa-pause-circle');
        element.classList.add('fa-play-circle');
    });
};

Array.from(document.getElementsByClassName('songItemPlay')).forEach((element, i) => {
    element.addEventListener('click', (e) => {
        makeAllPlays();
        songIndex = i;
        e.target.classList.remove('fa-play-circle');
        e.target.classList.add('fa-pause-circle');
        audioElement.src = songs[songIndex].filePath;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    });
});

document.getElementById('next').addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    makeAllPlays();
    let songItemPlays = document.getElementsByClassName('songItemPlay');
    if (songItemPlays[songIndex]) {
        songItemPlays[songIndex].classList.remove('fa-play-circle');
        songItemPlays[songIndex].classList.add('fa-pause-circle');
    }
});

document.getElementById('previous').addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    audioElement.src = songs[songIndex].filePath;
    masterSongName.innerText = songs[songIndex].songName;
    audioElement.currentTime = 0;
    audioElement.play();
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    makeAllPlays();
    let songItemPlays = document.getElementsByClassName('songItemPlay');
    if (songItemPlays[songIndex]) {
        songItemPlays[songIndex].classList.remove('fa-play-circle');
        songItemPlays[songIndex].classList.add('fa-pause-circle');
    }
});

// Optional: When song ends, auto-play next
audioElement.addEventListener('ended', () => {
    document.getElementById('next').click();
});