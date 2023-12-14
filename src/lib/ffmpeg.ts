const ffmpeg = require("fluent-ffmpeg")

ffmpeg.setFfmpegPath("node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe")

module.exports = ffmpeg
