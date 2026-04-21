import { JsonValue } from "@prisma/client/runtime/library";

export interface SwaggerJSON {
  info: { 
    title: string;
    description?: string;
  };
  servers?: { url: string }[];
  components?: {
    securitySchemes?: Record<string, { description?: string }>;
    schemas?: Record<string, any>;
  };
  paths: Record<string, Record<string, any>>;
}

export interface ResolvedResource {
  path: string;
  metodo: string;
  tag: string;
  descricao: string;
  request: string;
  response: string;
  modelo_json: JsonValue;
}

export interface ResolvedProject {
  nome: string;
  url_base: string;
  scopes: { nome: string; descricao: string }[];
  recursos: ResolvedResource[];
}

/**
 * Resolve o schema do Swagger de forma recursiva para gerar um JSON de exemplo.
 */
function resolveSchema(schema: any, components: any, depth = 0): any {
  if (depth > 10) return "..."; // Evitar loop infinito em schemas recursivos

  if (!schema) return null;

  // Se for uma referência, buscar no components
  if (schema.$ref) {
    const refPath = schema.$ref.replace('#/components/schemas/', '');
    const refSchema = components?.schemas?.[refPath];
    if (!refSchema) return `Ref not found: ${refPath}`;
    return resolveSchema(refSchema, components, depth + 1);
  }

  // Se tiver um exemplo ou valor padrão, retornar ele
  if (schema.example !== undefined) return schema.example;
  if (schema.default !== undefined) return schema.default;

  // Lógica por tipo
  switch (schema.type) {
    case 'string':
      if (schema.format === 'date-time') return new Date().toISOString();
      if (schema.format === 'date') return new Date().toISOString().split('T')[0];
      return "";
    case 'number':
    case 'integer':
      return 0;
    case 'boolean':
      return false;
    case 'array':
      const itemExample = resolveSchema(schema.items, components, depth + 1);
      return [itemExample];
    case 'object':
      const obj: Record<string, any> = {};
      if (schema.properties) {
        for (const [key, prop] of Object.entries(schema.properties)) {
          obj[key] = resolveSchema(prop, components, depth + 1);
        }
      }
      return obj;
    default:
      // Caso não tenha tipo definido mas tenha propriedades
      if (schema.properties) {
        const obj: Record<string, any> = {};
        for (const [key, prop] of Object.entries(schema.properties)) {
          obj[key] = resolveSchema(prop, components, depth + 1);
        }
        return obj;
      }
      return null;
  }
}

export function parseSwagger(swagger: SwaggerJSON): ResolvedProject {
  const nome = swagger.info?.title || "Projeto Sem Título";
  const url_base = swagger.servers?.[0]?.url || "";
  
  const scopes: { nome: string; descricao: string }[] = [];
  if (swagger.components?.securitySchemes) {
    for (const [key, scheme] of Object.entries(swagger.components.securitySchemes)) {
      scopes.push({
        nome: key,
        descricao: scheme.description || ""
      });
    }
  }

  const recursos: ResolvedResource[] = [];

  for (const [path, methods] of Object.entries(swagger.paths)) {
    for (const [metodo, details] of Object.entries(methods)) {
      if (['get', 'post', 'put', 'delete', 'patch'].includes(metodo.toLowerCase())) {
        const tag = details.tags?.[0] || "Geral";
        const descricao = details.description || details.summary || "";
        
        // Extração de parâmetros de query
        const queryParams = details.parameters
          ?.filter((p: any) => p.in === 'query')
          .map((p: any) => p.name) || [];
        
        const queryParamsStr = queryParams.length > 0 ? `${queryParams.join(', ')} (query)` : "";

        // Tenta extrair o request e response originais (strings)
        const requestSchema = details.requestBody?.content?.['application/json']?.schema;
        const responseSchema = details.responses?.['200']?.content?.['application/json']?.schema 
                            || details.responses?.['201']?.content?.['application/json']?.schema;

        const requestMock = requestSchema ? resolveSchema(requestSchema, swagger.components) : null;
        const responseMock = responseSchema ? resolveSchema(responseSchema, swagger.components) : null;

        // Regra de mapeamento:
        // Request: QueryParams + Mock do Body (se houver)
        let finalRequest = queryParamsStr;
        if (requestMock) {
          const bodyStr = JSON.stringify(requestMock, null, 2);
          finalRequest = finalRequest ? `${finalRequest}\n\n${bodyStr}` : bodyStr;
        }

        recursos.push({
          path,
          metodo: metodo.toUpperCase(),
          tag,
          descricao,
          request: finalRequest,
          response: responseMock ? JSON.stringify(responseMock, null, 2) : "",
          modelo_json: responseMock as JsonValue
        });
      }
    }
  }

  return {
    nome,
    url_base,
    scopes,
    recursos
  };
}
