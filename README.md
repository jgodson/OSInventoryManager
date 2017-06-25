## Current State

I have the general UI style figured out and how routing works. I've spent a ton of time on things that I thought would need to be extendable (like routes, settings and other components that need to be reused, etc.). 

I can build the app for MacOS, Windows and Linux, however since I've used sqlite3 for my database my builds only work on MacOS as it needs to be built on the system that it will run on it seems. I'm considering using a different storage method, although I do like the Sequelize ORM so I may just keep it as is and build it on the different OS's when I get to the point where I release it.

I would like to add an auto updater to it as I think that would be an excellent feature, but I may look into just releasing it on app stores as well.

Adding error logging to a file or something (or error reporting) is also something I think would be handy

I wanted to be able to password protect the local database, but I have not yet figured out a good solution to this. I'm not sure this is needed since the data is only stored locally, but I would like to see it implemented anyway.

<details><summary>Click for screenshots</summary>

### Dashboard
![alt](https://screenshot.click/10-15-31qfz-s9lgo.jpg)

### Notifications
![alt](https://screenshot.click/10-15-kocfo-3bpk7.jpg)

![alt](https://screenshot.click/10-19-vjhz1-cc28a.jpg)

### Customer List
![alt](https://screenshot.click/10-16-usdhz-vhq8q.jpg)

### Customer Details
![alt](https://screenshot.click/10-16-40g50-tzj38.jpg)

![alt](https://screenshot.click/10-17-fsqev-ibhxh.jpg)

### New Customer
![alt](https://screenshot.click/10-17-vca3z-4pccp.jpg)

### Settings
![alt](https://screenshot.click/10-17-u31vp-t0kp3.jpg)

</details>
