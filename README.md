**Gallery D'Art** is a single page application for storing images in a virutal database. This app was inspired by the need for artists to showcase their work in times of social distancing. Images uploaded to the database are shared in the main gallery along side the work of other artists. Viewing an artist profile will give users more details about the artist, their contact information for art inquiries and contract work, and a gallery view featuring all of that artist's work. 

**[Deployed Server Application](https://ancient-garden-56671.herokuapp.com)** |
**[Client Repository](https://github.com/Drag-on-Drop/Avant-Gallery-Client)** |
**[Deployed Client Application](https://drag-on-drop.github.io/Avant-Gallery-Client/#/)**

**Technologies Used**
Express, MongoDB, Mongoose

**Server Routes**

|Request Type |     Path            |                 Description        |   Auth    |
|-------------|---------------------|------------------------------------|-----------|
| GET         |'/artworks'          | Show all Artworks                  |  Unauth   |
| GET         |'/artworks/:id'      | View Specific Artwork              |  Unauth   |
| GET         |'/artworks/recent'   | Return recent artwork for carousel |  Unauth   |
| GET         |'/artworks/user/:id' | Return artwork exclusivly by a user|  Unauth   |
| PATCH       |'/artworks/:id/patch'| Edit a user specific Artwork       |  Auth     |
| POST        |'/post-artwork'      | Upload a piece of artwork          |  Auth     |
| DELETE      |'/artworks/:id'      | Delete a piece of artwork          |  Auth     |
| POST        |'/sign-up'           | sign up an account                 |  Unaut    |
| POST        |'/Sign-in'           | Sign in with an existing account   |  Unuth    |
| PATCH       |'/change-password'   | User Change Password               |  Auth     |
| Delete      |'/sign-out'          | User Sign out                      |  Auth     |
| GET         |'/artists/:id'       | View an Artists profile            |  Unauth   |



**Unsolved Problems**

- make a tag view - click the tag on the art the show all art with that tag
- formatting, better spacing, css on center image
- development of artist profile, give the artist a main pictures, possibly a carousel of their own art to give each artist their own space
- add an about blurb to give the viewer an understanding of what the website is about
- sign in should redirect the user to their profile
- occasionally when you click on an artists profile, the art won't show up
- remove "dead" code
- fix update artist bug

**Entitiy Relationship Diagram**

![Entity Relationship Diagram](https://github.com/Drag-on-Drop/Avant-Gallery-Server/blob/master/Avant%20Gallery%20ERD.PNG "Entity Relationship Diagram")

**Planning, Process and Problem Solving Strategy**

We approached this project by breaking it down into a set of smaller taksks that could be completed in daily sprints which we assigned and tracked in a project plan through development. We would meet in the morning to agree on tasks and meet mid-day to guage progress and mob-program any issues anyone on the team was having. We used this approach until near the end of development when we we only had a few small issues left and we split our team of four into two groups to tackle these issues including building development of aws image upload functionality and editing user and art profiles. 

![Project Plan](https://github.com/Drag-on-Drop/Avant-Gallery-Server/blob/master/Avant%20Gallery%20Project%20Plan.PNG "Project Plan")
