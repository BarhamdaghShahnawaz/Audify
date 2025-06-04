// Initialize variables
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

// Default songs
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

// Initialize the player
function initializePlayer() {
    // Load default songs
    songs = [...defaultSongs];
    renderSongList();
    
    // Set up event listeners
    masterPlay.addEventListener('click', togglePlay);
    progressBar.addEventListener('change', seekSong);
    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', playNext);
    document.getElementById('previous').addEventListener('click', playPrevious);
    document.getElementById('next').addEventListener('click', playNext);
    uploadButton.addEventListener('click', () => fileUpload.click());
    fileUpload.addEventListener('change', handleFileUpload);
}

// Render song list
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
        
        // Add click event to play the song
        songItem.querySelector('.songItemPlay').addEventListener('click', () => playSong(index));
    });
}

// Play a specific song
function playSong(index) {
    currentSong = index;
    const song = songs[currentSong];
    
    audioElement.src = song.file;
    audioElement.play();
    
    masterPlay.classList.remove('fa-play-circle');
    masterPlay.classList.add('fa-pause-circle');
    
    gif.style.opacity = 1;
    masterSongName.innerText = `${song.name} - ${song.artist}`;
    
    // Highlight the playing song
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

// Toggle play/pause
function togglePlay() {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        if (audioElement.src === '') {
            playSong(0); // Play first song if none is selected
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

// Update progress bar
function updateProgress() {
    if (audioElement.duration) {
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        progressBar.value = progress;
    }
}

// Seek song
function seekSong() {
    const seekTime = (progressBar.value / 100) * audioElement.duration;
    audioElement.currentTime = seekTime;
}

// Play next song
function playNext() {
    currentSong = (currentSong + 1) % songs.length;
    playSong(currentSong);
}

// Play previous song
function playPrevious() {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    playSong(currentSong);
}

// Handle file upload
function handleFileUpload(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
        
        // Create a URL for the uploaded file
        const fileURL = URL.createObjectURL(file);
        
        // Add the new song to the playlist
        const newSong = {
            name: fileName,
            artist: "Uploaded Song",
            file: fileURL,
            duration: "--:--"
        };
        
        songs.push(newSong);
        renderSongList();
        
        // Play the uploaded song if no song is playing
        if (audioElement.paused || audioElement.src === '') {
            playSong(songs.length - 1);
        }
        
        // Reset file input
        event.target.value = '';
    }
}

// Initialize the player when the page loads
window.onload = initializePlayer;