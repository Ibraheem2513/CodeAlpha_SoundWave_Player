// Music Player Data
const musicData = [
    {
        title: "Abstract Vibes",
        artist: "Electronic Dreams",
        cover: "assets/images/abstract.jpg",
        duration: "3:45",
        durationSeconds: 225,
        // Using a placeholder audio URL since we can't include actual music files
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Neon Dreams",
        artist: "Retro Future",
        cover: "assets/images/neon-dreams.jpg",
        duration: "4:12",
        durationSeconds: 252,
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    },
    {
        title: "Mountain High",
        artist: "Indie Collective",
        cover: "assets/images/mountain-high.jpg",
        duration: "3:28",
        durationSeconds: 208,
        src: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
    }
];

// Player State
let currentSongIndex = 0;
let isPlaying = false;
let isShuffled = false;
let repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
let currentTime = 0;
let duration = 0;
let volume = 0.7;

// DOM Elements
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const currentTimeSpan = document.getElementById('currentTime');
const totalTimeSpan = document.getElementById('totalTime');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');
const currentCover = document.getElementById('currentCover');
const currentTitle = document.getElementById('currentTitle');
const currentArtist = document.getElementById('currentArtist');
const songList = document.getElementById('songList');

// Initialize Player
document.addEventListener('DOMContentLoaded', function() {
    loadSong(currentSongIndex);
    setupEventListeners();
    updateVolumeIcon();
    audioPlayer.volume = volume;
    volumeSlider.value = volume * 100;
});

// Load Song
function loadSong(index) {
    const song = musicData[index];
    
    // Update audio source
    audioPlayer.src = song.src;
    
    // Update now playing info
    currentCover.src = song.cover;
    currentTitle.textContent = song.title;
    currentArtist.textContent = song.artist;
    totalTimeSpan.textContent = song.duration;
    
    // Update song list highlighting
    updateSongListHighlight();
    
    // Reset progress
    currentTime = 0;
    updateProgress();
    
    // Update document title
    document.title = `${song.title} - ${song.artist} | SoundWave`;
}

// Play/Pause Functions
function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function playSong() {
    audioPlayer.play().then(() => {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.body.classList.add('playing');
        startProgressUpdate();
    }).catch(error => {
        console.log('Playback failed:', error);
        // Simulate playback for demo purposes
        simulatePlayback();
    });
}

function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    document.body.classList.remove('playing');
    stopProgressUpdate();
}

// Simulate playback for demo (since we don't have actual audio files)
function simulatePlayback() {
    isPlaying = true;
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    document.body.classList.add('playing');
    
    // Simulate progress
    const song = musicData[currentSongIndex];
    const progressInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(progressInterval);
            return;
        }
        
        currentTime += 1;
        updateProgress();
        
        if (currentTime >= song.durationSeconds) {
            clearInterval(progressInterval);
            nextSong();
        }
    }, 1000);
}

// Navigation Functions
function nextSong() {
    if (isShuffled) {
        currentSongIndex = Math.floor(Math.random() * musicData.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % musicData.length;
    }
    
    loadSong(currentSongIndex);
    if (isPlaying) {
        playSong();
    }
}

function prevSong() {
    if (currentTime > 3) {
        // If more than 3 seconds played, restart current song
        currentTime = 0;
        audioPlayer.currentTime = 0;
        updateProgress();
    } else {
        // Go to previous song
        currentSongIndex = currentSongIndex === 0 ? musicData.length - 1 : currentSongIndex - 1;
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
}

// Shuffle Function
function toggleShuffle() {
    isShuffled = !isShuffled;
    shuffleBtn.classList.toggle('active', isShuffled);
    
    if (isShuffled) {
        showNotification('Shuffle enabled');
    } else {
        showNotification('Shuffle disabled');
    }
}

// Repeat Function
function toggleRepeat() {
    repeatMode = (repeatMode + 1) % 3;
    
    switch (repeatMode) {
        case 0:
            repeatBtn.classList.remove('active');
            repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
            showNotification('Repeat off');
            break;
        case 1:
            repeatBtn.classList.add('active');
            repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
            showNotification('Repeat all');
            break;
        case 2:
            repeatBtn.classList.add('active');
            repeatBtn.innerHTML = '<i class="fas fa-redo"></i><span style="font-size: 0.7em;">1</span>';
            showNotification('Repeat one');
            break;
    }
}

// Progress Functions
function updateProgress() {
    const song = musicData[currentSongIndex];
    const progressPercent = (currentTime / song.durationSeconds) * 100;
    
    progressFill.style.width = `${progressPercent}%`;
    progressHandle.style.left = `${progressPercent}%`;
    currentTimeSpan.textContent = formatTime(currentTime);
}

function setProgress(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressPercent = (clickX / rect.width) * 100;
    
    const song = musicData[currentSongIndex];
    currentTime = (progressPercent / 100) * song.durationSeconds;
    audioPlayer.currentTime = currentTime;
    updateProgress();
}

// Volume Functions
function setVolume(value) {
    volume = value / 100;
    audioPlayer.volume = volume;
    updateVolumeIcon();
}

function toggleMute() {
    if (volume > 0) {
        audioPlayer.volume = 0;
        volumeSlider.value = 0;
        updateVolumeIcon();
    } else {
        audioPlayer.volume = 0.7;
        volumeSlider.value = 70;
        volume = 0.7;
        updateVolumeIcon();
    }
}

function updateVolumeIcon() {
    const volumeIcon = volumeBtn.querySelector('i');
    
    if (audioPlayer.volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (audioPlayer.volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Progress Update
let progressUpdateInterval;

function startProgressUpdate() {
    progressUpdateInterval = setInterval(() => {
        if (audioPlayer.currentTime) {
            currentTime = audioPlayer.currentTime;
            updateProgress();
        }
    }, 1000);
}

function stopProgressUpdate() {
    clearInterval(progressUpdateInterval);
}

// Song List Functions
function updateSongListHighlight() {
    const songItems = document.querySelectorAll('.song-item');
    songItems.forEach((item, index) => {
        item.classList.toggle('playing', index === currentSongIndex);
    });
}

function playSongFromList(index) {
    currentSongIndex = index;
    loadSong(currentSongIndex);
    playSong();
}

// Favorite Functions
function toggleFavorite(button, songIndex = null) {
    const heartIcon = button.querySelector('i');
    const isCurrentlyFavorited = heartIcon.classList.contains('fas');
    
    if (isCurrentlyFavorited) {
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        button.classList.remove('active');
    } else {
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        button.classList.add('active');
    }
    
    const songTitle = songIndex !== null ? musicData[songIndex].title : musicData[currentSongIndex].title;
    const action = isCurrentlyFavorited ? 'removed from' : 'added to';
    showNotification(`${songTitle} ${action} favorites`);
}

// Utility Functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1db954;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event Listeners
function setupEventListeners() {
    // Player controls
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    
    // Progress bar
    progressBar.addEventListener('click', setProgress);
    
    // Volume controls
    volumeSlider.addEventListener('input', (e) => setVolume(e.target.value));
    volumeBtn.addEventListener('click', toggleMute);
    
    // Song list
    songList.addEventListener('click', (e) => {
        const songItem = e.target.closest('.song-item');
        if (songItem) {
            const songIndex = parseInt(songItem.dataset.song);
            
            // Check if clicking on favorite button
            if (e.target.closest('.favorite-btn')) {
                const favoriteBtn = e.target.closest('.favorite-btn');
                toggleFavorite(favoriteBtn, songIndex);
                return;
            }
            
            // Play song
            playSongFromList(songIndex);
        }
    });
    
    // Current song favorite
    document.querySelector('.favorite-current').addEventListener('click', function() {
        toggleFavorite(this);
    });
    
    // Navigation menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Playlist cards
    document.querySelectorAll('.playlist-card').forEach(card => {
        card.addEventListener('click', function() {
            const playlistType = this.dataset.playlist;
            showNotification(`Opening ${playlistType} playlist`);
        });
    });
    
    // Audio events
    audioPlayer.addEventListener('loadedmetadata', () => {
        duration = audioPlayer.duration;
        totalTimeSpan.textContent = formatTime(duration);
    });
    
    audioPlayer.addEventListener('timeupdate', () => {
        currentTime = audioPlayer.currentTime;
        updateProgress();
    });
    
    audioPlayer.addEventListener('ended', () => {
        if (repeatMode === 2) {
            // Repeat one
            audioPlayer.currentTime = 0;
            playSong();
        } else if (repeatMode === 1 || currentSongIndex < musicData.length - 1) {
            // Repeat all or not last song
            nextSong();
        } else {
            // End of playlist
            pauseSong();
            currentTime = 0;
            updateProgress();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        
        switch (e.code) {
            case 'Space':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevSong();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSong();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const newVolumeUp = Math.min(100, parseInt(volumeSlider.value) + 10);
                volumeSlider.value = newVolumeUp;
                setVolume(newVolumeUp);
                break;
            case 'ArrowDown':
                e.preventDefault();
                const newVolumeDown = Math.max(0, parseInt(volumeSlider.value) - 10);
                volumeSlider.value = newVolumeDown;
                setVolume(newVolumeDown);
                break;
            case 'KeyM':
                e.preventDefault();
                toggleMute();
                break;
            case 'KeyS':
                e.preventDefault();
                toggleShuffle();
                break;
            case 'KeyR':
                e.preventDefault();
                toggleRepeat();
                break;
        }
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const songItems = document.querySelectorAll('.song-item');
        
        songItems.forEach(item => {
            const songIndex = parseInt(item.dataset.song);
            const song = musicData[songIndex];
            const isMatch = song.title.toLowerCase().includes(searchTerm) || 
                           song.artist.toLowerCase().includes(searchTerm);
            
            item.style.display = isMatch ? 'grid' : 'none';
        });
    });
}

// Progress bar drag functionality
let isDragging = false;

progressBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    setProgress(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        setProgress(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Touch support for mobile
progressBar.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    setProgress(mouseEvent);
});

document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        setProgress(mouseEvent);
    }
});

document.addEventListener('touchend', () => {
    isDragging = false;
});

// Initialize welcome message
setTimeout(() => {
    showNotification('Welcome to SoundWave! Press Space to play/pause');
}, 1000);

