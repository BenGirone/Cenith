<h1>Ben Girone - Take home assessment for Cenith Innovations</h1>

<h3>Layer Responsibilities</h3>
<ul>
  <li><strong>Game Engine Layer</strong> - Primary domain object, should be completely decoupled from API and Client.
  <li><strong>Repository Layer</strong> - Handles saving and loading of Game Engine states.
  <li><strong>API Service Layer</strong> - Routes requests to the Game Engine, returns state and any errors.</li>
  <li><strong>Client (not included)</strong> - Handles presentation of state and errors, A lot of logic derived from state is left for the frontend to compute, "have I won/lost yet?"</li>
</ul>

<h3>Issues</h3>
<ul>
  <li><strong>Testing isn't comprehensive</strong> - I developed with speed in mind so I kinda skipped doing TDD</li>
  <li><strong>Missing helpful libs</strong> - I would probably use something like Inversify for DI / IOC for a production app</li>
  <li><strong>GameEngine is dense</strong> - should probably break it into smaller pieces, but I think it is tolerable for a system this simple. However, It has the benefit of making the game very portable
</ul>
