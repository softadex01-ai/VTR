from api_scheduling import Request, compare_scheduling
from route_optimization import Graph, compare_routing

def run_api_scheduling_simulation():
    # Simulate Try-On API requests with (id, processing_time_in_ms, priority_score)
    requests = [
        Request("Req_1", 120, 10),
        Request("Req_2", 80,  8),
        Request("Req_3", 150, 15),
        Request("Req_4", 200, 20),
        Request("Req_5", 50,  5),
        Request("Req_6", 90,  12),
        Request("Req_7", 300, 25),
        Request("Req_8", 110, 14),
    ]
    
    # We only have a 500ms processing window on the GPU right now
    max_time_window = 500
    compare_scheduling(requests, max_time_window)

def run_delivery_route_simulation():
    # Simulate delivery graph (e.g. delivering the ordered physical clothes)
    graph = Graph()
    graph.add_edge("Warehouse", "A", 4)
    graph.add_edge("Warehouse", "B", 2)
    graph.add_edge("A", "C", 5)
    graph.add_edge("B", "C", 1)
    graph.add_edge("B", "D", 8)
    graph.add_edge("C", "Customer_1", 3)
    graph.add_edge("D", "Customer_1", 1)
    
    compare_routing(graph, "Warehouse", "Customer_1")

if __name__ == "__main__":
    print("=====================================================")
    print("   DAA SEMESTER PROJECT ALGORITHMS SIMULATION       ")
    print("=====================================================")
    run_api_scheduling_simulation()
    run_delivery_route_simulation()
    print("\nSimulation complete.")
