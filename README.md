# CCC181 Week 10: CampusConnect Mobile-First Login Page

React + TypeScript starter for the Week 10 group activity. The page is already
built. Your group's job is the **mobile-first CSS** and the **GitHub teamwork**.

## Run it

```bash
npm install
npm run dev          # open the local URL it prints
npm run dev:phone    # same, but your phone (same Wi-Fi) can open the Network URL
npm run build        # must finish with no errors before you submit
```

## Rules

- Edit only the CSS files in `src/styles/` (one member = one file). Do not edit `reset.css`.
- Plain CSS only. No Tailwind, Bootstrap, Material UI, styled-components, or any UI library.
- Phone styles first (no media query), then `min-width` queries only. Never `max-width`.
- Do not edit the `.tsx` files or rename classes. If you must, tell the group first.

## Group information (fill in)

| Item | Your answer |
| --- | --- |
| Group number | 5 |
| Section | BSIT-3B |
| Repository URL | https://github.com/jasminella-914/ccc181-week10-group5 |

## Members (each member fills in their own row in their own commit)

| Member | Name | GitHub username | CSS file | What I did |
| --- | --- | --- | --- | --- |
| 1 | Daniela Rose J. Suico | jasminella-914 | `base.css` | Added the viewport meta tag. Wrote the phone layout, the 768px container padding, the 1024px two-column layout with the larger heading and visible list, and the 1280px `max-width: 1200px` centered container. |
| 2 | Jessanie L. Sacabin| jessaniesacabin | `nav.css` | Edited `nav.css` to style the mobile menu navigation, setup flex box layout, and added responsive `min-width` breakpoints for tablet and desktop screens. |
| 3 | Norjane B. Lentija | norjane11 | `form.css` | Styled the login card in form.css using default phone rules, adjusted the form options and alt-actions for 768px screens, and updated card padding and title font size at 1024px. |

## Experiment 0: the page without the viewport tag

> Before the viewport tag, DevTools phone mode (iPhone SE) showed the page zoomed
> out and tiny, as if it were a ~980px desktop page shrunk to fit the phone. The
> text was hard to read and our mobile CSS did not look the way we planned.
> After adding `<meta name="viewport" content="width=device-width, initial-scale=1">`,
> the page used the real device width. The text was readable at normal size, the
> nav links stacked, and the layout fit the screen.

## DevTools test results

| Width | What must be true | Pass? |
| --- | --- | --- |
| 360 px | 1 column. Nav links stacked and 48px tall. Options and buttons stacked. Footer in 1 column. No sideways scrollbar. |X|
| 768 px | Nav in one row (brand left, links right). Checkbox and link in one row. Two buttons side by side. |X|
| 1024 px | Brand panel and login card side by side. Footer in 3 columns. Heading is larger. |X|
| 1280 px | Content centered and stops at 1200px. |X|

### Breakpoints I observed

> Using Show media queries and dragging from 360px to 1280px, the layout changed at:
> - 768px: the nav switched to one row, the checkbox and "Forgot password?" moved
>   side by side, and the two bottom buttons moved side by side.
> - 1024px: the brand panel and login card moved side by side, the footer became
>   3 columns, the heading grew to 2.5rem, and the extra list appeared.
> - 1280px: the content stopped growing and stayed centered at 1200px.
>
> No width looked broken, and there was no sideways scrollbar, including when the
> error messages and the success message were shown.


Screenshots are in `screenshots/` as `360.png`, `768.png`, `1024.png`, `1280.png`.

## What our group learned (leader writes this last)

> Our group learned that mobile-first means writing the phone layout first with no media query, then adding layout with `min-width` queries as the screen grows.
> The viewport meta tag is required, or the phone layout never applies.
> We used Grid for page-level layouts (the login layout and footer) and Flexbox for components (the navbar, form rows and buttons). Making every tap target at least 48px tall and giving every hover style a focus-visible style made the page easier to use.
> Working in separate CSS files and merging through reviewed pull requests meant we had no CSS conflicts, and each member's contribution showed in the commit history.
