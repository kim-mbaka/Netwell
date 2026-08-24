from django.core.management.base import BaseCommand
from netwellapp.models import PricingPlan, BlogPost, AboutPage

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **options):
        # Clear existing data
        PricingPlan.objects.all().delete()
        BlogPost.objects.all().delete()
        AboutPage.objects.all().delete()

        # Create pricing plans
        plans = [
            {
                'title': '4 Mbps Plan',
                'speed': '4 Mbps',
                'price': 1000,
                'features': ['Standard definition streaming', 'Basic voice calls', 'Light web browsing']
            },
            {
                'title': '8 Mbps Plan',
                'speed': '8 Mbps',
                'price': 1500,
                'features': ['Smooth HD streaming', 'Clear video calls', 'Social media scrolling']
            },
            {
                'title': '12 Mbps Plan',
                'speed': '12 Mbps',
                'price': 2000,
                'features': ['Dual device streaming', 'Group video meetings', 'Smart home basics']
            },
            {
                'title': '15 Mbps Plan',
                'speed': '15 Mbps',
                'price': 2500,
                'features': ['Single screen 4K', 'Multi device HD', 'Fast app downloads']
            },
            {
                'title': '20 Mbps Plan',
                'speed': '20 Mbps',
                'price': 3000,
                'features': ['Small household hub', 'Flawless multi streaming', 'Casual online gaming']
            },
        ]

        for plan in plans:
            PricingPlan.objects.create(**plan)
            self.stdout.write(self.style.SUCCESS(f"Created plan: {plan['title']}"))

        # Create blog posts
        blog_posts = [
            {
                'title': 'Wi-Fi Connected But No Internet? Try These 8 Fixes',
                'slug': 'wifi-connected-but-no-internet-fixes',
                'meta_title': 'Wi-Fi Connected But No Internet? Try These 8 Fixes',
                'meta_description': 'Your Wi-Fi shows "connected" but nothing loads? Here are 8 simple fixes Kenyan homes can try before calling support.',
                'body': """## Why this happens

There is nothing more confusing than seeing full Wi-Fi bars on your phone while every page refuses to load. Your device says you are connected, but WhatsApp will not send, YouTube will not play, and your browser just spins. This is one of the most common internet complaints in Kenyan homes, and in most cases, it has nothing to do with your phone.

## Start with the basics

### 1. Restart your router and fibre box

This sounds too simple to work, but it solves the majority of "connected but no internet" cases. Switch off your router and the small fibre box (ONT) next to it, wait about 30 seconds, then switch them back on in the same order they were plugged in. Give it two to three minutes to fully reconnect before testing again.

### 2. Check if your bundle or subscription has expired

If you are on a data plan rather than an unlimited package, an expired bundle will often still show "connected" on your Wi-Fi icon even though you have no data left to browse with. Check your account balance through your provider's app or a quick SMS or USSD check before assuming it is a technical fault.

### 3. Look for an outage in your area

Sometimes the issue is not in your house at all. Roadworks, storms, or maintenance work nearby can affect the line reaching your home. Check your provider's official social media pages or support line to see if there is a known outage in your area.

### 4. Check the lights on your fibre box

The small box mounted on your wall (the ONT) usually has indicator lights for power, signal, and internet. If the "internet" or "LOS" light is red or off, the problem is likely with the incoming line rather than your router, and you will need to report it to your provider.

## Device and signal checks

### 5. Forget the network and reconnect

On your phone or laptop, go to Wi-Fi settings, "forget" the network, then reconnect using the password. This clears up small glitches where your device thinks it is connected but is actually stuck on an old, broken connection.

### 6. Restart the device having trouble

If only one device is affected while others in the house are fine, the issue is likely with that device, not your internet. Restart the phone, laptop, or TV having trouble and try again.

### 7. Move closer to the router

Being too far from the router, or having thick walls in between, can cause a device to stay "connected" while barely receiving any actual data. Move closer and see if the problem clears up.

### 8. Check for too many connected devices

Routers can only comfortably handle so many devices at once. If your household has many phones, laptops, smart TVs, and CCTV cameras all connected, some devices may show as connected while getting almost no bandwidth. Disconnect devices you are not using and test again.

## When to escalate

If you have gone through all eight steps and you are still stuck, the fault is most likely on the line itself, not in your home.

## Why Netwell Fiber helps

Netwell Fiber customers get fast, reliable connections backed by a support team that responds quickly when something goes wrong. If your internet still is not working after trying these fixes, reach out to Netwell Fiber support and we will get you back online, with no long hold times and no runaround.""",
                'excerpt': 'Your Wi-Fi shows "connected" but nothing loads? Here are 8 simple fixes Kenyan homes can try before calling support.'
            },
            {
                'title': 'Internet Suddenly Stopped Working? Here\'s What to Check',
                'slug': 'internet-suddenly-stopped-working-what-to-check',
                'meta_title': 'Internet Suddenly Stopped Working? Here\'s What to Check',
                'meta_description': 'Was your internet fine yesterday but dead today? Here\'s a simple checklist to figure out what\'s wrong and get back online fast.',
                'body': """## Why this feels so stressful

Internet that was working perfectly and then suddenly stops is one of the most frustrating situations, especially in the middle of work, a stream, or a video call. Before you panic or start unplugging things at random, work through this checklist. Most of the time, the cause is something quick to spot and even quicker to fix.

## Quick checks to run first

### Check for a power interruption

A Kenya Power outage does not just switch off your lights; it also switches off your router and fibre box. If the power has come back but your internet has not, give the equipment a few minutes to fully restart, since the fibre box can take longer to come back online than your lights do.

### Look at your router and fibre box lights

Both devices have small indicator lights. A steady green or blue light usually means things are fine, while red, orange, or blinking lights often point to a problem with the incoming connection rather than your Wi-Fi. Take note of which lights look wrong; it will help support diagnose the issue faster if you need to call in.

### Confirm it is not a wider outage

Sometimes the problem is not just in your house. Fibre cables can be affected by roadworks, construction, or heavy weather nearby. Check your provider's social media pages or support line for any announcements about outages in your area before assuming the fault is with your own equipment.

### Check your account status

If you are on a prepaid plan, confirm that your subscription has not run out or that a payment did not fail to go through. This is an easy thing to overlook when the internet stops working right in the middle of the month.

## Restart and inspect your setup

### Restart your equipment properly

Turn off both the router and the fibre box, wait about 30 seconds, then power them back on, fibre box first, followed by the router. This forces both devices to reconnect to the network from scratch and clears up a large share of sudden outages.

### Check your cables

Loose or damaged cables between the fibre box, router, and wall socket are a common and often overlooked cause. Make sure everything is firmly plugged in, and check that no cable has been chewed, pinched, or knocked loose, especially if you have pets or small children at home.

### Test with a different device

Connect a different phone or laptop to your Wi-Fi. If the second device also has no internet, the problem is with your connection. If it works fine, the issue is isolated to the first device instead.

## When to call support

### Know when to call support

If you have worked through all of the above and you are still offline, it is time to contact your provider. Have your account details and a description of the router lights ready; it will make the call much faster.

## Final thought

A sudden outage is stressful, especially when you are relying on your connection for work or school. Netwell Fiber's support team is on hand to help you troubleshoot quickly and get a technician out when needed, so you are never left guessing what went wrong. Save our support line so it is ready whenever you need it.""",
                'excerpt': 'Was your internet fine yesterday but dead today? Here\'s a simple checklist to figure out what\'s wrong and get back online fast.'
            },
            {
                'title': 'Why Does My Router Keep Disconnecting?',
                'slug': 'why-does-my-router-keep-disconnecting',
                'meta_title': 'Why Does My Router Keep Disconnecting?',
                'meta_description': 'Wi-Fi dropping every few minutes? Here are the most common reasons routers keep disconnecting, and how to stop it for good.',
                'body': """## What this usually means

A router that disconnects every few minutes is one of the most annoying home internet problems, especially when it happens during a video call or while streaming. The good news is that this issue usually comes down to a small number of causes, most of which you can fix yourself without any technical knowledge.

## Common causes

### Your router is overheating

Routers generate heat, and if yours is tucked inside a closed cabinet, stacked with other electronics, or sitting in direct sunlight, it can overheat and disconnect to protect itself. Give your router open space to breathe, away from direct sun and other heat-generating devices like decoders or DVRs.

### Too many devices are connected

Every phone, laptop, smart TV, and smart plug in your home takes up a share of your router's capacity. Once too many devices are connected at once, especially older routers, the connection can become unstable and start dropping devices to cope with the load.

### The router's software is out of date

Routers run on software that occasionally needs updating, similar to your phone's apps. An outdated router can behave unpredictably, including disconnecting for no clear reason. Check your router's app or settings page for available updates, or ask your provider whether your router is due for a firmware update.

### Interference from other electronics

Microwaves, baby monitors, cordless phones, and even some Bluetooth devices can interfere with Wi-Fi signals, particularly on the 2.4GHz band. If your router keeps dropping around the same time you use certain appliances, that is a strong clue.

### Unstable power supply

Frequent power fluctuations, common during the rainy season or in areas with unreliable Kenya Power supply, can stress your router's components over time and cause it to reset or disconnect randomly. A surge protector can help extend your router's lifespan and reduce these interruptions.

### The router itself is old or faulty

Routers do not last forever. If yours is several years old and has been repeatedly restarted, updated, and repositioned with no improvement, it may simply be reaching the end of its usable life.

## Network conditions to watch for

### Network congestion during peak hours

In the evenings, when most households in your area are online at once, you may notice more frequent drops. This is often a sign of congestion rather than a fault with your own equipment.

## What you can do about it

- Reposition your router in an open, central spot
- Restart it regularly
- Disconnect devices you are not using
- Check whether the issue happens only at peak hours

If the problem continues after trying these steps, it is worth having your line and equipment checked by a technician, since the cause may be outside your home.

## Final takeaway

Constant disconnections should not be something you just live with. Netwell Fiber provides stable, high-capacity connections built for busy Kenyan households, along with routers that are set up correctly from day one. If your connection keeps dropping, get in touch and we will send a technician to sort it out properly.""",
                'excerpt': 'Wi-Fi dropping every few minutes? Here are the most common reasons routers keep disconnecting, and how to stop it for good.'
            },
            {
                'title': 'Why Is My Internet Fast on My Phone But Slow on My TV?',
                'slug': 'why-is-my-internet-fast-on-my-phone-but-slow-on-my-tv',
                'meta_title': 'Why Is My Internet Fast on My Phone But Slow on My TV?',
                'meta_description': 'Same Wi-Fi, different speeds? Here\'s why your phone loads instantly while your smart TV lags, and how to fix it.',
                'body': """## Why this happens

It is a strange but common complaint: your phone loads pages instantly, yet your smart TV buffers even with the exact same Wi-Fi network. The truth is, not every device experiences your internet the same way, even when they are connected to the same router.

## The most common reasons

### Your phone and TV may be using different Wi-Fi bands

Most modern routers broadcast two Wi-Fi bands: 2.4GHz and 5GHz. The 5GHz band is faster but has a shorter range, while 2.4GHz travels further but is slower and more prone to interference. Phones often connect to whichever band gives the strongest signal, while some smart TVs default to the slower 2.4GHz band, even when 5GHz is available.

### Distance and walls matter more for TVs

Phones move around with you, but TVs stay fixed in one spot, often against a wall and further from the router than you would expect. Walls, furniture, and even the TV's own casing can weaken the signal reaching it, resulting in a noticeably slower connection than your phone experiences in another room.

### Older smart TVs have weaker Wi-Fi hardware

Phones are updated and replaced far more often than TVs. If your smart TV is a few years old, its built-in Wi-Fi receiver may simply be less capable than the one in your current phone, regardless of how strong your internet plan is.

### Background updates and apps use up bandwidth

Smart TVs often run background processes, app updates, and syncing that you do not see happening. These quietly use up bandwidth and can slow down your streaming without any obvious warning on screen.

## Better fixes

### Use a wired connection if possible

If your TV is anywhere near your router, running a simple Ethernet cable between them removes Wi-Fi from the equation entirely. Wired connections are more stable and typically faster than Wi-Fi, and most smart TVs have a LAN port built in for exactly this purpose.

### Reposition the router

A router placed in a bedroom corner might give your phone a strong signal, while your TV in the living room struggles with a weaker one. Central placement, away from walls and large furniture, improves the experience for every device in the house, not just one.

## What to try today

- Move your TV closer to the router
- Switch the TV to the 5GHz band if it is available
- Restart the TV and router together
- Use an Ethernet cable if the TV is nearby

## Final note

If the issue persists even after trying these steps, your home may benefit from better Wi-Fi coverage. Netwell Fiber can assess your home setup and recommend the right router placement or additional access points, so every device, not just your phone, gets the speed you are paying for. Talk to our team about a free home coverage check.""",
                'excerpt': 'Same Wi-Fi, different speeds? Here\'s why your phone loads instantly while your smart TV lags, and how to fix it.'
            },
            {
                'title': 'Why Can\'t My Smart TV Connect to Wi-Fi?',
                'slug': 'why-cant-my-smart-tv-connect-to-wifi',
                'meta_title': 'Why Can\'t My Smart TV Connect to Wi-Fi?',
                'meta_description': 'Smart TV refusing to connect to Wi-Fi? Here are the most common causes and simple steps to get it back online.',
                'body': """## Why this happens

A smart TV that will not connect to Wi-Fi can turn a relaxing evening into a frustrating one, especially when your phone connects to the same network without any issue. Before you assume the TV is broken, work through these common causes; most smart TV connection problems have simple explanations.

## Common fixes to try

### Double-check the Wi-Fi password

It sounds obvious, but typing the Wi-Fi password on a TV remote is fiddly, and it is easy to mistype a character, especially with passwords that mix capital letters and numbers. Re-enter it carefully, or check your router for the correct password printed on the label.

### Make sure your TV is using the right Wi-Fi band

If your router broadcasts separate 2.4GHz and 5GHz networks, make sure you are selecting the right one. Some older smart TVs can only connect to 2.4GHz, so if you only see the 5GHz network in the list, or the TV will not connect to it, try the 2.4GHz option instead.

### Check whether router settings are blocking new devices

Some routers have device limits or filtering settings that prevent new devices from joining the network. If you have recently reset your router or changed settings, check whether device filtering is switched on and add your TV manually if needed.

### Update the TV software

Smart TVs sometimes need a software update before Wi-Fi will work properly, particularly after long periods without updates. If your TV has a wired internet port, connect it briefly with a cable to update the software, then try connecting to Wi-Fi again.

## Signal and connection issues

### Check the signal strength

TVs are often mounted far from the router, and a weak signal can prevent a stable connection from forming at all, even if it briefly appears to connect. Moving the router closer, or using a wired connection instead, often solves this immediately.

### Restart both the TV and the router

Turn off the TV completely, restart your router, and then turn the TV back on before attempting to connect again. This clears temporary glitches on both ends and is worth trying before anything more complicated.

### Reset the network settings

Most smart TVs have an option in their settings menu to reset network settings specifically, without affecting anything else on the TV. This wipes any saved but corrupted Wi-Fi profiles and lets you set up the connection fresh.

## When to consider a bigger fix

- Your TV is very old and has weak Wi-Fi hardware
- The signal is weak in the room where the TV is mounted
- The router is too far away or blocked by walls

If none of these steps work, the issue could be with the TV's Wi-Fi hardware itself, especially on older models. Using a Wi-Fi adapter or Ethernet cable is a reliable workaround while you figure out a longer-term solution.

## Final word

Streaming should be simple, not a fight with your TV settings. Netwell Fiber's support team can help you troubleshoot connection issues on any device, and our technicians can advise on the best router setup for a home full of smart TVs, consoles, and streaming boxes. Reach out and let's get your TV back online.""",
                'excerpt': 'Smart TV refusing to connect to Wi-Fi? Here are the most common causes and simple steps to get it back online.'
            },
            {
                'title': 'Why Does Netflix Keep Buffering?',
                'slug': 'why-does-netflix-keep-buffering',
                'meta_title': 'Why Does Netflix Keep Buffering?',
                'meta_description': 'Netflix pausing to buffer at the worst moments? Here\'s why it happens and practical ways to stop it for good.',
                'body': """## Why buffering happens

Few things are more annoying than your show pausing to buffer right at the best part. Buffering happens when your device cannot pull data fast enough to keep up with playback, and while it is easy to blame Netflix, the real cause is usually much closer to home.

## What to check first

### Your internet speed may not match what you are streaming

Streaming in HD or 4K requires significantly more speed than standard definition. If several people in your household are streaming, gaming, or downloading at the same time, your available speed per device drops, and buffering becomes far more likely. Check your plan's speed against how many people and devices are using it at once.

### Too many devices are active at the same time

It is easy to forget how many things are quietly using your internet in the background: a phone syncing photos, a laptop downloading an update, a smart TV in another room left on standby. All of this competes with your stream for bandwidth.

### Wi-Fi signal strength between your router and TV

Even with a fast plan, a weak signal between your router and your streaming device will cause buffering. Walls, distance, and interference all reduce the amount of usable signal that actually reaches your TV or streaming box.

### The Netflix app or device needs updating

Outdated apps and outdated TV or streaming box software can cause playback issues that look like a slow connection but are not. Check for pending updates on both the Netflix app and your device's system software.

## Peak-time issues

### Evening congestion

Buffering that consistently happens in the evening, when most households are streaming, gaming, or on video calls at once, often points to network congestion rather than a fault with your specific connection.

### Fair usage policies and throttling

Some internet plans slow down speeds after a certain amount of data has been used in a month, even if the plan is labelled unlimited. If your buffering seems to get worse as the month goes on, it is worth checking whether your plan has this kind of usage cap.

## Simple fixes that actually work

- Restart your router and streaming device
- Move closer to the router or switch to a wired connection
- Lower your streaming quality slightly if needed
- Disconnect devices you are not actively using
- Test your internet speed at different times of day

## Final takeaway

Smooth streaming comes down to having enough speed for how your household actually uses the internet, not just a number on a plan. Netwell Fiber offers packages built for multi-device, multi-person homes, so everyone can stream in HD at the same time without the buffering wheel showing up. Check out our packages to find the right fit for your household.""",
                'excerpt': 'Netflix pausing to buffer at the worst moments? Here\'s why it happens and practical ways to stop it for good.'
            },
            {
                'title': 'Why Does My Wi-Fi Work in One Room but Not Another?',
                'slug': 'why-does-my-wifi-work-in-one-room-but-not-another',
                'meta_title': 'Why Does My Wi-Fi Work in One Room but Not Another?',
                'meta_description': 'Strong Wi-Fi in the living room but nothing in the bedroom? Here\'s why Wi-Fi dead zones happen and how to fix them.',
                'body': """## Why dead zones happen

You have full signal in the living room, but the moment you walk into the bedroom or kitchen, your Wi-Fi disappears. This is one of the most common complaints in homes with more than one room between them and the router, and it has a straightforward explanation: Wi-Fi signal weakens the further it has to travel, and certain things block it more than others.

## What weakens your signal

### Walls and floors weaken the signal

Every wall your Wi-Fi signal passes through reduces its strength, and some materials are worse than others. Concrete, brick, and metal reinforcements (common in many Kenyan homes) block signal far more than wooden partitions or glass. A router on one side of a concrete wall may struggle to reach even a nearby room properly.

### Router placement is often the real problem

Routers tucked into a corner, hidden inside a TV cabinet, or placed on the floor tend to give the worst overall coverage. Wi-Fi spreads outward in all directions from the router, so a central, elevated, open position almost always performs better than a router hidden out of sight.

### Distance adds up quickly

Signal strength drops the further you get from the router, and it does not take a huge distance for it to become noticeable, especially in larger homes or those with multiple floors. A bedroom at the far end of the house is often simply too far from a router placed near the entrance.

### Household appliances cause interference

Microwaves, refrigerators, and even some baby monitors can interfere with Wi-Fi signals passing nearby. If a dead zone happens to be near the kitchen, this is worth considering.

## Larger homes need a better layout

### Multi-storey homes need more than one router can offer

A single router, no matter how good, has physical limits on how far it can reliably cover, especially through multiple floors. Homes with more than one level often have strong Wi-Fi downstairs and weak or nonexistent coverage upstairs, or the other way around.

### Mesh Wi-Fi and access points solve this properly

Rather than boosting a single router's signal, mesh systems and additional access points create multiple connection points throughout your home that work together as one network. This is generally a more reliable long-term fix for dead zones than range extenders, which can sometimes create a slower, separate network instead of extending the original one.

## How Netwell Fiber can help

If you have tried repositioning your router and dead zones persist, the fix usually is not your internet plan; it is your home's coverage setup. Netwell Fiber technicians can assess your home layout and recommend the right combination of router placement, access points, or mesh coverage so every room gets a reliable connection, not just the one closest to the router. Ask us about a home Wi-Fi assessment when you sign up or if you are experiencing patchy coverage.""",
                'excerpt': 'Strong Wi-Fi in the living room but nothing in the bedroom? Here\'s why Wi-Fi dead zones happen and how to fix them.'
            },
            {
                'title': 'How to Restart Your Router Properly',
                'slug': 'how-to-restart-your-router-properly',
                'meta_title': 'How to Restart Your Router Properly',
                'meta_description': 'Restarting your router the right way fixes more problems than you\'d expect. Here\'s exactly how to do it, step by step.',
                'body': """## Why a restart works

"Have you tried restarting your router?" is not just something support agents say to get you off the phone; it genuinely fixes a huge share of common internet problems. But there is a right way and a wrong way to do it, and doing it properly makes a real difference in how effective it actually is.

## The reason behind it

### Why restarting fixes so many problems

Routers are small computers, and like any computer, they can build up minor glitches over time from constant use, temporary software errors, or too many connected devices. Restarting clears out this temporary buildup and forces the router to reconnect to the network fresh, which resolves a large number of everyday issues like slow speeds, dropped connections, and devices that will not connect.

### Power cycling is different from just unplugging

Simply pulling the plug and immediately plugging it back in does not give the router enough time to fully power down. A proper restart, known as power cycling, means switching the device off completely, waiting a short period, and then switching it back on. This short pause is what allows the router's memory to clear properly before it starts back up.

## The correct steps

### Step 1: Switch off both devices

Turn off your router and fibre box (ONT) if you have one separate from the router.

### Step 2: Wait at least 30 seconds

Give the devices a short pause before powering them back on. A full minute is even safer.

### Step 3: Power on the fibre box first

Turn the fibre box back on first and let it fully reconnect, usually indicated by steady lights.

### Step 4: Power on the router

Then turn your router back on and give it another minute or two to fully boot up and reconnect to the network.

## Important detail

### Restart your fibre box and router together, not just one

Many people only restart their router and forget the fibre box entirely. If your internet is still misbehaving after restarting just the router, restart both devices in the correct order described above; this resolves issues that a router-only restart can miss.

## App restart vs physical restart

### Using an app versus a physical restart

Some routers, particularly those provided by fibre companies, can be restarted remotely through a companion app. This is convenient, but a physical power cycle (switching it off at the socket) is sometimes more effective, since it fully cuts power rather than just issuing a software restart command.

## How often is best

### How often should you restart your router

You do not need to restart your router daily, but doing it once every week or two, especially if your household has many connected devices, helps prevent slowdowns and glitches from building up. If you notice your internet consistently getting slower a few days before you would normally restart it, that is a sign it is due for one.

## When to stop restarting and call support

### When restarting does not help

If a proper restart does not fix the issue, the problem likely is not with your router at all; it is more likely to be an issue with the incoming line, your account, or an outage in your area. At that point, it is time to check for known outages or contact your provider rather than continuing to restart the same equipment.

## Final reminder

A simple restart, done properly, solves more problems than most people expect. But if you have followed these steps and you are still without a reliable connection, Netwell Fiber's support team is ready to help, whether that means remote troubleshooting or sending a technician to your home. Get in touch and we will have you back online quickly.""",
                'excerpt': 'Restarting your router the right way fixes more problems than you\'d expect. Here\'s exactly how to do it, step by step.'
            },
        ]

        for post in blog_posts:
            BlogPost.objects.create(**post)
            self.stdout.write(self.style.SUCCESS(f"Created blog post: {post['title']}"))

        # Create about page
        about = AboutPage.objects.create(
            content='Welcome to Netwell Fiber!\n\nWe are committed to providing the fastest, most reliable fiber internet service in the region. Our mission is to connect communities with high-speed internet that empowers businesses and homes.\n\nWith state-of-the-art infrastructure and customer-first service, Netwell Fiber is your trusted partner for digital connectivity.\n\nContact us today to learn more about our services!'
        )
        self.stdout.write(self.style.SUCCESS("Created about page"))
