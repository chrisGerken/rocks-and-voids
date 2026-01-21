# Rocks and Voids

A client-side 3D graphics simulation where objects move according to defined behaviors. Built with JavaScript and three.js.

## Quick Start

1. Open `index.html` in a web browser (Chrome, Firefox, or Safari)
2. Type commands in the input field at the bottom right
3. Press Enter to execute

### Example Session

```
place large yellow sphere named "sun" at (0,0,0)
sun -emits light -intensity 1.5
place small blue sphere named "earth" at (50,0,0)
earth -orbits sun -period 10s
camera position 0 100 150
camera lookat sun
start
```

Or enter multiple commands at once using semicolons:

```
place large yellow sphere named "sun" at (0,0,0); sun -emits light -intensity 1.5; place small blue sphere named "earth" at (50,0,0); earth -orbits sun -period 10s; camera; camera lookat sun; start
```

## User Interface

The interface has three panels:

1. **3D Render Panel** (left) - Displays the simulation
2. **Status Panel** (upper right) - Shows messages, errors, and help output
3. **Command Panel** (lower right) - Chat-like command input with history

### Keyboard Shortcuts

- **Enter** - Execute command
- **Up Arrow** - Navigate to previous command in history
- **Down Arrow** - Navigate to next command in history

## Command Reference

### Object Management

#### place
Create and position an object in the arena.

```
place <size> <color> <shape> named "<name>" at (x,y,z)
```

**Parameters:**
- `size`: small, medium, or large
- `color`: Named color (red, blue, yellow, green, white, gray, orange, purple, etc.)
- `shape`: sphere, cube, or pyramid
- `name`: Unique identifier for the object (in quotes)
- `(x,y,z)`: Position coordinates

**Examples:**
```
place medium red cube named "cube1" at (10,10,10)
place small yellow sphere named "sun" at (0,0,0)
place large blue pyramid named "marker" at (100,0,100)
```

### Object Behaviors

Behaviors are applied to existing objects using the object name followed by flags.

#### -still
Make an object stationary.

```
<object-name> -still
```

#### -orbits
Make an object orbit around another object.

```
<object-name> -orbits <target-name> -period <time>
```

**Parameters:**
- `target-name`: Name of object to orbit around
- `period`: Orbital period (e.g., `10s`, `5m`, `500ms`)

**Example:**
```
earth -orbits sun -period 30s
```

#### -follows
Make an object follow another object while maintaining minimum distance.

```
<object-name> -follows <target-name> -distance <min-distance>
```

**Parameters:**
- `target-name`: Name of object to follow
- `distance`: Minimum distance to maintain (optional, default: 10)

**Example:**
```
drone -follows player -distance 20
```

### Light Emission

Objects can emit light matching their color.

```
<object-name> -emits light -intensity <value> [-oscillates -period <time>]
```

**Parameters:**
- `intensity`: Light brightness (0.0 to 2.0+)
- `oscillates`: Optional flag for pulsing light
- `period`: Oscillation period if oscillating

**Examples:**
```
sun -emits light -intensity 1.5
beacon -emits light -intensity 0.8 -oscillates -period 2s
```

### Camera Control

#### camera
Create and configure the camera. A camera is required before starting the simulation.

```
camera                              # Create with default position
camera position <x> <y> <z>         # Set camera position
camera position (x,y,z)             # Alternative syntax
camera lookat <object-name>         # Look at an object
camera lookat (x,y,z)               # Look at a position
```

The camera can also have behaviors:
```
camera -orbits sun -period 60s      # Orbiting camera
camera -follows player -distance 50  # Following camera
```

**Examples:**
```
camera position 0 100 200
camera lookat sun
```

### Simulation Control

#### start
Start the simulation. Requires a camera to be defined.

```
start
```

#### stop
Pause the simulation. Objects retain their positions.

```
stop
```

#### reset
Stop simulation, remove all objects, and clear the screen.

```
reset
```

#### clear
Clear the status messages and command history (keeps simulation running).

```
clear
```

### Configuration

#### config
View or modify simulation settings.

```
config                      # Show current configuration
config arena <size>         # Set arena size in meters
config frametime <seconds>  # Set physics time step
config basesize <meters>    # Set base object size (medium)
```

**Examples:**
```
config arena 2000
config frametime 0.05
config basesize 20
```

### File Operations

#### import
Load and execute commands from a text file.

```
import
```

Opens a file picker to select a `.txt` file. Commands are executed one per line. Lines starting with `#` are treated as comments.

### Help

#### help
Show available commands or detailed help for a specific command.

```
help                    # List all commands
help <command-name>     # Help for specific command
<command> --help        # Alternative syntax
```

## Script Files

Script files are plain text with one command per line. Comments start with `#`.

**Example: solar-system.txt**
```
# Solar System Demo
place large yellow sphere named "sun" at (0,0,0)
sun -still
sun -emits light -intensity 1.5

place small blue sphere named "earth" at (50,0,0)
earth -orbits sun -period 30s

place small gray sphere named "moon" at (60,0,0)
moon -orbits earth -period 5s

camera position 0 100 150
camera lookat sun

start
```

## Coordinate System

- Uses three.js conventions: **Y-up, right-handed** coordinate system
- Origin (0,0,0) is at the center of the arena
- Default arena size: 1000m × 1000m × 1000m cube

## Object Sizes

| Size   | Default Height |
|--------|----------------|
| small  | 2.5m          |
| medium | 10m           |
| large  | 20m           |

Base size is configurable via `config basesize <meters>`.

## Available Colors

Basic: red, green, blue, yellow, cyan, magenta, white, black

Grays: gray, darkgray, lightgray

Extended: orange, pink, purple, brown, gold, silver, coral, crimson, indigo, navy, teal, olive, maroon

Light variants: lightblue, lightgreen, lightyellow, lightpink

## Tips

1. **Set up before starting**: Define all objects and their behaviors before running `start` to ensure correct initial positions for orbits.

2. **Use semicolons**: Enter multiple commands on one line separated by `;` for faster setup.

3. **Camera is required**: The simulation won't start without a camera defined.

4. **Orbit timing**: When setting up orbiting objects, place them at the correct initial distance from their target before setting the orbit behavior.

5. **Reset for clean slate**: Use `reset` to clear everything and start fresh.
