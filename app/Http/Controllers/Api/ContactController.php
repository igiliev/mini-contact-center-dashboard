<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Models\Contact;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    // GET /api/contacts?search=...&page=...
    public function index(Request $request)
    {
        $search = trim((string) $request->query('search', ''));

        $query = Contact::query();

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return response()->json(
            $query->orderByDesc('id')->paginate(10)
        );
    }

    // GET /api/contacts/{id} (includes interactions)
    public function show(int $id)
    {
        $contact = Contact::with(['interactions' => fn($q) => $q->orderByDesc('timestamp')])
            ->findOrFail($id);

        return response()->json($contact);
    }

    // POST /api/contacts
    public function store(StoreContactRequest $request)
    {
        $contact = Contact::create($request->validated());

        return response()->json($contact, 201);
    }

    // PUT /api/contacts/{id}
    public function update(UpdateContactRequest $request, int $id)
    {
        $contact = Contact::findOrFail($id);
        $contact->update($request->validated());

        return response()->json($contact);
    }

    // DELETE /api/contacts/{id}
    public function destroy(int $id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json(null, 204);
    }
}
