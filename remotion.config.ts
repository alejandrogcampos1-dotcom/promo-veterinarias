import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setStillImageFormat('png');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
// Rango de color estándar (bt709). Sin esto el MP4 sale marcado como
// "full range" y algunos reproductores lo muestran lavado o quemado.
Config.setColorSpace('bt709');

// Chromium propio (útil en servidores/containers donde ya hay uno instalado).
// Si no está seteada la variable, Remotion usa/descarga el suyo: no hace falta tocar nada.
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
