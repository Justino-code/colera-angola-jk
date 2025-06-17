
<div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Gestão de Províncias</h1>

    {{-- Formulário para criar nova província --}}
    <div class="bg-white shadow rounded p-4 mb-6">
        <form method="POST" action="/provincia_test">
            @csrf
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Nome</label>
                    <input type="text" name="nome" class="mt-1 block w-full rounded border-gray-300" required>
                </div>
                <div class="md:col-span-2 flex items-end">
                    <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                        Adicionar Província
                    </button>
                </div>
            </div>
        </form>
    </div>