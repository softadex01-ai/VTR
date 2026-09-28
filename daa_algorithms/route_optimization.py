import heapq
import time
from collections import deque

class Graph:
    def __init__(self):
        self.edges = {}
        
    def add_edge(self, u, v, weight):
        if u not in self.edges:
            self.edges[u] = []
        if v not in self.edges:
            self.edges[v] = []
        # Undirected graph representing delivery locations
        self.edges[u].append((v, weight))
        self.edges[v].append((u, weight))

def bfs_shortest_path(graph, start, end):
    """
    Breadth-First Search for shortest path (ignores weights, finds fewest hops).
    """
    queue = deque([(start, [start], 0)])
    visited = set([start])
    
    while queue:
        node, path, total_weight = queue.popleft()
        
        if node == end:
            return path, total_weight
            
        for neighbor, weight in graph.edges.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor], total_weight + weight))
                
    return None, float('inf')

def dijkstra_shortest_path(graph, start, end):
    """
    Dijkstra's Algorithm for shortest path based on actual weights/distances.
    """
    # Priority queue: (total_weight, current_node, path)
    pq = [(0, start, [start])]
    visited = set()
    
    while pq:
        current_weight, current_node, path = heapq.heappop(pq)
        
        if current_node in visited:
            continue
            
        visited.add(current_node)
        
        if current_node == end:
            return path, current_weight
            
        for neighbor, weight in graph.edges.get(current_node, []):
            if neighbor not in visited:
                heapq.heappush(pq, (current_weight + weight, neighbor, path + [neighbor]))
                
    return None, float('inf')

def compare_routing(graph, start, end):
    print(f"\n--- Delivery Route Optimization Comparison ---")
    print(f"Finding route from {start} to {end}")
    
    start_time = time.time()
    bfs_path, bfs_weight = bfs_shortest_path(graph, start, end)
    bfs_time = time.time() - start_time
    
    start_time = time.time()
    dijkstra_path, dijkstra_weight = dijkstra_shortest_path(graph, start, end)
    dijkstra_time = time.time() - start_time
    
    print(f"[BFS]      Path: {bfs_path}, Total Distance: {bfs_weight}, Time taken: {bfs_time:.5f}s")
    print(f"[Dijkstra] Path: {dijkstra_path}, Total Distance: {dijkstra_weight}, Time taken: {dijkstra_time:.5f}s")
    return bfs_weight, dijkstra_weight
