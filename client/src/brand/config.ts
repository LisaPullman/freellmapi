/* foxai brand config ---------------------------------------------------------
   Single source of truth for everything the brand layer surfaces. The wordmark
   text lives here so the navbar, auth card and settings dialog don't drift
   from each other or from the <title> tag. Adding strings to other call sites
   without coming back to this file is the kind of mistake that ages badly. */

export const BRAND = {
  name: 'foxai',
  tagline: 'One key. Every model.',
  /** Display name for the navbar / auth card. Capitalised because that is
   *  where the brand is read first; the wordmark itself stays lowercase. */
  display: 'foxai',
} as const