# Project Revisit  
## A Robotics Visualizer  
![Screen capture of Revisit](/assets/images/readme.png)
## Project Description  
Project Revisit is a web based application for displaying robotics simulations, with the following goals in mind:  

**Platform independence:**  
Programming languages exist that satisfy this factor of the project’s development. The application if implemented using one of these languages would run natively on the user’s machine. With this approach there would still be the matter of installing the programming language and downloading the executable. Browser based applications on the other hand, are highly accessible to anyone with a web-browser installed and it is the case that most personal computers come with these installed.  

**Real Time Interactivity:**  
A prerecorded video places the burden on the videographer to display all appropriate viewing angles and movement. The interactive component of this project will allow the user to control these factors.  

**Utility to Other Researchers:**  
A video is useful reference material and can provide valuable insight into the work of another researcher. Production time for a video can have a large impact on the quality of experience. If time is a currency for a researcher than that currency might be better spent on continued research. Thus one aim of this project is provide a useful tool that robotics researchers may use to cut down on the time necessary to produce a consistent demonstration of their findings.  

All of these factors -- platform independence, real time interactivity, and utility to other researchers -- have an impact on what the final product is expected to be in terms of usability, availability, and the overall quality.

http://0.0.0.0:8000/?logref=file:///Users/ajc/Documents/projects/DART-examples/sphere_visualized

https://sketchfab.com/
https://clara.io/

https://threejs.org/
https://www.babylonjs.com/
https://cesiumjs.org/

http://xeogl.org/

https://gist.github.com/dmnsgn/76878ba6903cf15789b712464875cfdc
https://github.com/KhronosGroup/glTF
https://github.com/google/draco
https://github.com/KhronosGroup/glTF-Sample-Models/tree/master/2.0

https://www.khronos.org/webgl/wiki/Presentations
https://www.youtube.com/watch?v=fmStv3_6_VE
https://www.youtube.com/watch?v=dAtdE4LQCSc

http://blog.selfshadow.com/publications/s2017-shading-course/
https://www.marmoset.co/posts/basic-theory-of-physically-based-rendering/
https://www.marmoset.co/posts/physically-based-rendering-and-you-can-too/






- flow
- typescript
- keyboard interface
    + "5" --> 5 seconds
    + "left arrow" --> left model
    + "p" --> pause/play

- streaming back end
- embedded into a web page
- responsive interface
- A splash screen with minimal instructions (drag and drop a log file, copy and paste a url query, go here for more information). Basically, this would be behind the canvas and only shows when there is no animation.
- An easier way to input a url (instead of as a url query). Could they paste a url (you could intercept the paste event)?
- A way to have the camera follow a specific group. The user could click on a group and the camera would automatically follow that group. If they click somewhere off of any group then the camera would go back to normal mode.

- icons octicon

- floor color

- compress data file format

- don't open new windows unless requested (reset the current visualizer)

- vuejs for UI

- package it up with webpack

- error for unsupported browsers/hardware/etc.
- detect old browser

- don't use system color chooser

- vertical z-axis

- drag-and-drop multiple files
- drag-and-drop folder (like gltf-viewer)
- show ghosts (not side-by-side)

- webassembly
- 

update url with scene state (time, angle, etc.)
