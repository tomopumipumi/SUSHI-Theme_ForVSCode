<div style="text-align: center;">
  <h1>🍣 SUSHI-Theme v1.0.0</h1>
  <p><b>Welcome to the best Sushi restaurant in your editor.</b></p>
  <blockquote style="background: #fff3cd; color: #856404; padding: 10px; border-left: 5px solid #ffeeba; display: inline-block;">
    ⚠️ <b>Warning:</b> May cause sudden cravings for sushi.
  </blockquote>
  <br><br>
  <img width="1919" height="1035" alt="Image" src="./images/all.png" />
</div>

<br><br>

<h2>🍣 Fresh Features</h2>

<table style="width: 100%; border: none; border-collapse: collapse;">
  <tr>
    <td style="width: 55%; text-align: center; padding: 20px; vertical-align: middle;">
      <img width="390" height="94" alt="Image" src="./images/status_bar.png" />
    </td>
    <td style="width: 45%; padding: 20px; vertical-align: middle;">
      <h3>🍣 SUSHI Memory Indicator</h3>
      <p>Check your system memory usage easily right in your status bar.</p>
      <p>Low memory = A few pieces of sushi.<br>
      High memory = A full plate of sushi!</p>
      <p style="font-size: 0.9em; color: #888;">Hover to see detailed System & Extension memory stats.</p>
    </td>
  </tr>
  
  <tr>
    <td style="width: 45%; padding: 20px; vertical-align: middle;">
      <h3>🥢 Omakase Typing Effects</h3>
      <p>Every keystroke drops a piece of sushi! Enjoy a smooth, zero-lag experience powered by our high-performance ECS engine.</p>
      <p>Build your combo to upgrade your sushi. Choose your favorite topping: <b>Maguro, Ikura, Ebi, Matcha</b>, or let the chef decide with <b>Random</b> mode.</p>
    </td>
    <td style="width: 55%; text-align: center; padding: 20px; vertical-align: middle;">
      <img width="426" height="240" alt="Image" src="./images/normal.gif" />
    </td>
  </tr>

  <tr>
    <td style="width: 55%; text-align: center; padding: 20px; vertical-align: middle;">
      <img width="426" height="240" alt="Image" src="./images/fever.gif" />
    </td>
    <td style="width: 45%; padding: 20px; vertical-align: middle;">
      <h3>🔥 FEVER TIME!</h3>
      <p>Type fast and don't break your combo! Hit the target (default: 50) to trigger <b>FEVER MODE</b>.</p>
      <p>Enjoy a shower of golden glowing sushi, active line highlights, and a blazing status bar animation.</p>
    </td>
  </tr>
</table>

<br><br>

<h2>⚙️ Custom Orders (Settings)</h2>

<p>You can customize your sushi experience from VS Code settings (<code>Preferences: Open Settings</code> and search for <code>sushiTheme</code>).</p>

<table style="width: 100%; border-collapse: collapse; text-align: left; border: 1px solid #ddd;">
  <thead style="background-color: #f8f9fa;">
    <tr>
      <th style="padding: 12px; border-bottom: 2px solid #ddd;">Setting Name</th>
      <th style="padding: 12px; border-bottom: 2px solid #ddd; text-align: center;">Default</th>
      <th style="padding: 12px; border-bottom: 2px solid #ddd;">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>Enable Status Bar</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;"><code>true</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Show StatusBar (Sushi memory indicator)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>Effect Type</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;"><code>random</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Select the flying sushi effect on typing. (Default: Random)<br><span style="font-size: 0.9em; color: #666;"><i>Options: maguro, ikura, ebi, matcha, random, none</i></span></td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>Combo Unit</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;"><code>5</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Keystrokes to upgrade sushi (Default: 5)<br><span style="font-size: 0.9em; color: #666;"><i>Min: 1 / Max: 10000</i></span></td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>Combo Timeout Ms</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;"><code>1500</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Time (in ms) before combo resets (Default: 1500)<br><span style="font-size: 0.9em; color: #666;"><i>Min: 500 / Max: 100000</i></span></td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>Fever Trigger Combo</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;"><code>50</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Number of combos to start Fever Time.<br><span style="font-size: 0.9em; color: #666;"><i>Min: 10 / Max: 10000</i></span></td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>Fever Duration Ms</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;"><code>10000</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">How long Fever Time lasts in milliseconds (e.g., 10000 = 10 seconds).<br><span style="font-size: 0.9em; color: #666;"><i>Min: 1 / Max: 100000</i></span></td>
    </tr>
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>Fever Spawn Count</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;"><code>5</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Number of sushi dropped per keystroke in Fever Time.<br><span style="font-size: 0.9em; color: #666;"><i>Min: 1 / Max: 20</i></span></td>
    </tr>
    <!-- 新規追加: Throttle Ms -->
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;"><code>Throttle Ms</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;"><code>80</code></td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">Set the minimum time (in milliseconds) between effect renders to prevent editor lag during continuous typing. Increase this value if you experience performance issues.<br><span style="font-size: 0.9em; color: #666;"><i>Min: 16 / Max: 1000</i></span></td>
    </tr>
  </tbody>
</table>

<br><br>

<div style="text-align: center; margin-top: 30px;">
  <p style="font-size: 1.1em;"><i>Ready to order? Download now and enjoy your meal! 🍣✨</i></p>
</div>