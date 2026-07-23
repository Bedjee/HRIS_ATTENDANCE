<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClusterRequest;
use App\Services\ClusterService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClusterController extends Controller
{
    protected $clusterService;

    public function __construct(ClusterService $clusterService)
    {
        $this->clusterService = $clusterService;
    }

    public function index(Request $request)
    {
        $clusters = $this->clusterService->getAll($request->input('per_page', 10));
        return Inertia::render('HR/Clusters/Index', [
            'clusters' => $clusters,
        ]);
    }

    public function create()
    {
        return Inertia::render('HR/Clusters/Create');
    }

    public function store(StoreClusterRequest $request)
    {
        $this->clusterService->create($request->validated());
        return redirect()->route('hr.clusters.index')->with('success', 'Cluster created.');
    }

    public function edit($id)
    {
        $cluster = $this->clusterService->getById($id);
        return Inertia::render('HR/Clusters/Edit', ['cluster' => $cluster]);
    }

    public function update(StoreClusterRequest $request, $id)
    {
        $this->clusterService->update($id, $request->validated());
        return redirect()->route('hr.clusters.index')->with('success', 'Cluster updated.');
    }

    public function destroy($id)
    {
        try {
            $this->clusterService->delete($id);
            return back()->with('success', 'Cluster deleted.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
