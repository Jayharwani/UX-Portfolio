/* Vite's ?raw suffix hands back the file's text at build time. Declared here
   because the previews' source is displayed in the page, and it must be the
   real file rather than a copy that can drift from what actually runs. */
declare module "*?raw" {
  const content: string;
  export default content;
}
