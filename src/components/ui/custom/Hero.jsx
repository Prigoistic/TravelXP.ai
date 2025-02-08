import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Button from '../button';
import { Link } from 'react-router-dom';

function Hero() {
    const globeRef = useRef(null);

    useEffect(() => {
        const container = globeRef.current;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const geometry = new THREE.SphereGeometry(3, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffab00,
            opacity: 0.1,
            transparent: true,
            wireframe: true
        });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffab00, 1);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        camera.position.z = 10;

        const animate = () => {
            requestAnimationFrame(animate);
            globe.rotation.y += 0.001;
            globe.rotation.x += 0.0005;
            renderer.render(scene, camera);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            if (container) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div className="hero-container">
            <div ref={globeRef} className="globe-container" />
            <h1 className="hero-title">
                <span className="hero-title-span">&quot;Dream, Explore, Discover:&quot;</span> 
                AI-Crafted Journeys Tailored to Your Passions, Pace, and Budget—Optimized for Hidden Gems & Stress-Free Adventures.
            </h1>
            <p className="hero-description">

                &quot;From first click to final destination, our AI designs trips as unique as you are—guaranteed.&quot;
            </p>  
            <div className="hero-button">
                <Link to="/create-trip">
                    <Button text="Get Started, it's free!"/>
                </Link>
            </div>
        </div>
    );
}

export default Hero;
