
let songs = [];
let currentSong = 0;
let audioElement = new Audio();
let masterPlay = document.getElementById('masterPlay');
let progressBar = document.getElementById('myProgressBar');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songContainer = document.getElementById('songContainer');
let uploadButton = document.getElementById('uploadButton');
let fileUpload = document.getElementById('fileUpload');

const defaultSongs = [
    {
        name: "AAj BHi Song",
        artist: "Vishal Mishra",
        file: "songs/1.mp3",
        duration: "04:20"
    },
    {
        name: "Chali Kahani Song",
        artist: "A.R Rahman",
        file: "songs/2.mp3",
        duration: "05:00"
    },
    {
        name: "Dil Meri Na Sune Song",
        artist: "Atif Aslam",
        file: "songs/3.mp3",
        duration: "04:05"
    },
    {
        name: "Lo maan liya Song",
        artist: "Arijit Singh",
        file: "songs/4.mp3",
        duration: "04:42"
    },
    {
        name: "RETRO - GULL AINAA Song",
        artist: "Hriday Gattani",
        file: "songs/5.mp3",
        duration: "05:34"
    }
];

function initializePlayer() {

    songs = [...defaultSongs];
    renderSongList();

    masterPlay.addEventListener('click', togglePlay);
    progressBar.addEventListener('change', seekSong);
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', playNext);
    document.getElementById('previous').addEventListener('click', playPrevious);
    document.getElementById('next').addEventListener('click', playNext);
    uploadButton.addEventListener('click', () => fileUpload.click());
    fileUpload.addEventListener('change', handleFileUpload);
}

function renderSongList() {
    songContainer.innerHTML = '';
    songs.forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'songItem';
        songItem.innerHTML = `
            <span class="songName">${song.name} - ${song.artist}</span>
            <span class="songlistplay">
                <span class="timestamp">${song.duration || '--:--'}
                    <i id="song-${index}" class="far songItemPlay fa-play-circle" aria-label="Play ${song.name}"></i>
                </span>
            </span>
        `;
        songContainer.appendChild(songItem);

        songItem.querySelector('.songItemPlay').addEventListener('click', () => playSong(index));
    });
}

function playSong(index) {
    currentSong = index;
    const song = songs[currentSong];

    audioElement.src = song.file;
    audioElement.play();

    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');

    gif.style.opacity = 1;
    masterSongName.innerText = `${song.name} - ${song.artist}`;

    const allSongItems = document.querySelectorAll('.songItem');
    allSongItems.forEach((item, i) => {
        const icon = item.querySelector('.songItemPlay');
        if (i === index) {
            icon.classList.remove('fa-play-circle');
            icon.classList.add('fa-pause-circle');
            item.style.backgroundColor = '#e0e0e0';
        } else {
            icon.classList.remove('fa-pause-circle');
            icon.classList.add('fa-play-circle');
            item.style.backgroundColor = 'white';
        }
    });
}


function togglePlay() {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        if (audioElement.src === '') {
            playSong(0);
        } else {
            audioElement.play();
        }
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
        gif.style.opacity = 1;
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
}

function updateProgress() {
    if (audioElement.duration) {
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        progressBar.value = progress;
    }
}

function seekSong() {
    const seekTime = (progressBar.value / 100) * audioElement.duration;
    audioElement.currentTime = seekTime;
}

function playNext() {
    currentSong = (currentSong + 1) % songs.length;
    playSong(currentSong);
}

function playPrevious() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    playSong(currentSong);
}

function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];
        const fileName = file.name.replace(/\.[^/.]+$/, "");


        const fileURL = URL.createObjectURL(file);


        const newSong = {
            name: fileName,
            artist: "Uploaded Song",
            file: fileURL,
            duration: "--:--"
        };

        songs.push(newSong);
        renderSongList();


        if (audioElement.paused || audioElement.src === '') {
            playSong(songs.length - 1);
        }


        event.target.value = '';
    }
}


window.onload = initializePlayer;

const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

volumeSlider.addEventListener('input', function () {
    audioElement.volume = this.value;

    if (this.value == 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (this.value < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
});

volumeIcon.addEventListener('click', function () {
    if (audioElement.volume > 0) {
        audioElement.volume = 0;
        volumeSlider.value = 0;
        this.className = 'fas fa-volume-mute';
    } else {
        audioElement.volume = 0.7;
        volumeSlider.value = 0.7;
        this.className = 'fas fa-volume-up';
    }
});