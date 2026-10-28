import { useCallback, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import type { FeatureCollection } from 'geojson';
import type { Topology } from 'topojson-specification';
import worldData from 'world-atlas/countries-110m.json';
import type { GlobeMarker } from '@modules/admin/types';
import styles from './OrthographicGlobe.module.css';

export interface OrthographicGlobeProps {
  markers: GlobeMarker[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  rotation?: [number, number];
  onRotationChange?: (rotation: [number, number]) => void;
  ariaLabel: string;
}

const DEFAULT_ROTATION: [number, number] = [0, -20];

export function OrthographicGlobe({
  markers,
  selectedId,
  onSelect,
  rotation: controlledRotation,
  onRotationChange,
  ariaLabel,
}: OrthographicGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rotationRef = useRef<[number, number]>(controlledRotation ?? DEFAULT_ROTATION);
  const sizeRef = useRef(400);

  const render = useCallback(() => {
    const svg = d3.select(svgRef.current);
    if (!svgRef.current) return;

    const size = sizeRef.current;
    const radius = size / 2.1;
    const [lambda, phi] = rotationRef.current;

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([size / 2, size / 2])
      .rotate([lambda, phi])
      .clipAngle(90);

    const path = d3.geoPath(projection);

    const topology = worldData as unknown as Topology;
    const landFeature = feature(topology, topology.objects.countries) as FeatureCollection;

    svg
      .select<SVGPathElement>('.land')
      .attr('d', path(landFeature) ?? '');

    const markerGroup = svg.select<SVGGElement>('.markers');
    const markerSel = markerGroup
      .selectAll<SVGGElement, GlobeMarker>('g.marker')
      .data(markers, (d) => (d as GlobeMarker).id);

    markerSel.exit().remove();

    const enter = markerSel
      .enter()
      .append('g')
      .attr('class', 'marker')
      .attr('role', 'button')
      .attr('tabindex', 0)
      .style('cursor', 'pointer');

    enter.append('circle').attr('class', 'pulse');
    enter.append('circle').attr('class', 'dot');

    const merged = enter.merge(markerSel);

    merged.each(function (marker) {
      const coords = projection([marker.lon, marker.lat]);
      const visible = coords !== null;
      const group = d3.select(this);
      group.style('display', visible ? 'block' : 'none');
      if (!visible || !coords) return;

      const isSelected = marker.id === selectedId || Boolean(marker.selected);
      group.attr('transform', `translate(${coords[0]},${coords[1]})`);
      group.attr('aria-label', marker.label);
      group.classed('selected', isSelected);

      group
        .select('.dot')
        .attr('r', isSelected ? 6 : 4)
        .attr('fill', 'var(--color-primary)');

      group
        .select('.pulse')
        .attr('r', isSelected ? 12 : 0)
        .attr('fill', 'none')
        .attr('stroke', 'var(--color-primary)')
        .attr('stroke-width', 2)
        .attr('opacity', isSelected ? 0.6 : 0);
    });

    merged
      .on('click', (_, marker) => onSelect(marker.id))
      .on('keydown', (event, marker) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(marker.id);
        }
      });
  }, [markers, onSelect, selectedId]);

  useEffect(() => {
    if (controlledRotation) {
      rotationRef.current = controlledRotation;
      render();
    }
  }, [controlledRotation, render]);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const topology = worldData as unknown as Topology;
    const countries = feature(topology, topology.objects.countries) as FeatureCollection;

    svg
      .append('circle')
      .attr('class', styles.sphere)
      .attr('fill', 'var(--color-surface-muted)')
      .attr('stroke', 'var(--color-border)');

    svg
      .append('path')
      .attr('class', `land ${styles.land}`)
      .datum(countries)
      .attr('fill', 'var(--coral-200)')
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 0.5);

    svg.append('g').attr('class', 'markers');

    const drag = d3
      .drag<SVGSVGElement, unknown>()
      .on('drag', (event) => {
        const k = 0.3;
        const [lambda, phi] = rotationRef.current;
        const next: [number, number] = [lambda + event.dx * k, phi - event.dy * k];
        rotationRef.current = next;
        onRotationChange?.(next);
        render();
      });

    svg.call(drag as never);
    render();
  }, [onRotationChange, render]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const width = entry.contentRect.width;
      const height = entry.contentRect.height;
      const size = Math.min(width, height, 560);
      sizeRef.current = size;

      const svg = d3.select(svgRef.current);
      svg.attr('width', size).attr('height', size);
      svg
        .select(`.${styles.sphere}`)
        .attr('cx', size / 2)
        .attr('cy', size / 2)
        .attr('r', size / 2.1);

      render();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [render]);

  useEffect(() => {
    render();
  }, [markers, selectedId, render]);

  return (
    <div
      ref={containerRef}
      className={styles.container}
      role="group"
      aria-label={ariaLabel}
    >
      <svg ref={svgRef} className={styles.svg} aria-hidden focusable="false" />
    </div>
  );
}
